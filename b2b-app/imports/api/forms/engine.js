import { createTypeErrorMsg } from 'pdf-lib'

const debug = require('debug')('app:forms:engine')

let survey = { steps: [] }
let currentStep
let currentQ
let current

const slugify = (text) => {
  if (!text || typeof text !== 'string') return 'no-slug'
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
}

const addQ = (survey, prompt) => {
  if (!currentStep) addStep(survey, 'Step 1')
  currentQ = { prompt, answers: [], grid: [], id: slugify(prompt), type: 'text' }
  currentStep.questions.push(currentQ)
  return currentQ
}

const addStep = (survey, title) => {
  currentStep = { name: title, questions: [], id: slugify(title) }
  survey.steps.push(currentStep)
  return currentStep
}

const addGrid = (survey, title) => {
  currentGrid = { title, id: slugify(title) }
  currentQ.grid.push(currentGrid)
  return currentGrid
}

const addAnswer = (survey, text) => {
  currentA = { name: text, id: slugify(text), type: 'text' }
  currentQ.answers.push(currentA)
  return currentA
}

const objects = [
  { name: 'Question', letters: 'QT', method: addQ },
  { name: 'Grid', letters: 'G', method: addGrid },
  { name: 'Answer', letters: 'A', method: addAnswer },
  { name: 'Step', letters: 'S', method: addStep },
]

objects.forEach((o) => {
  o.regex = new RegExp(`^\\s*[${o.letters}][:\\s=]+(.*)\$`, 'i')
})

export const parse = (source) => {
  if (typeof source !== 'string') throw new Error('Parameter to parse must be a string')
  try {
    currentStep = currentQ = current = null
    survey = {
      steps: [],
      name: 'Sample Survey',
      slug: 'sample',
      version: '1',
      active: true,
    }
    const result = { status: 'failed', errs: [] }
    const lines = source.split('\n').map((line) => line.trim())
    lines.forEach((line, ix) => {
      const lineno = ix + 1
      // COMMENT
      // debug(`${lineno}: ${line}`)
      if (line && !line.match(/^\s*#/)) {
        let got = false
        objects.forEach((o) => {
          const m = line.match(o.regex)
          // debug(o.regex.toString(), m)
          if (m) {
            // debug(`${o.name}: ${m[1]}`)
            if (o.method) {
              current = o.method(survey, m[1])
            }
            got = true
          }
        })
        if (!got) {
          const m = line.match(/^\s*\+([a-z0-9]+)[:=\s]*(.*)$/i)
          if (m) {
            got = true
            const [match, key, value] = m
            current[key] = value || true
          }
        }
        if (!got) result.errs.push({ lineno, error: `I could not understand`, line })
      }
    })
    if (result.errs.length) return result
    return { status: 'success', survey }
  } catch (e) {
    return { status: 'exception', message: e.message }
  }
}
