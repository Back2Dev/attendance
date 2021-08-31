import { getError } from './engine-errors'

const debug = require('debug')('app:forms:engine')

let survey = { sections: [] }
let currentStep
let currentQ
let current
let errs

const slugify = (text) => {
  if (!text || typeof text !== 'string') return 'no-slug'
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
}

const addQ = (survey, title) => {
  if (!currentStep) addStep(survey, 'Step 1')
  currentQ = { title, answers: [], grid: [], id: slugify(title), type: 'text' }
  currentStep.questions.push(currentQ)
  return currentQ
}

const addStep = (survey, title) => {
  currentStep = { title, questions: [], id: slugify(title) }
  survey.sections.push(currentStep)
  return currentStep
}

const addGrid = (survey, title) => {
  currentGrid = { title, id: slugify(title) }
  currentQ.grid.push(currentGrid)
  return currentGrid
}

const addAnswer = (survey, text) => {
  currentA = { title: text, id: slugify(text), type: 'text' }
  if (!currentQ) {
    return { errCode: 'e-no-ans' }
  } else currentQ.answers.push(currentA)
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
  currentStep = currentQ = current = null
  errs = []
  if (typeof source !== 'string') throw new Error('Parameter to parse must be a string')
  try {
    currentStep = currentQ = current = null
    survey = {
      sections: [],
      name: 'Sample Survey',
      slug: 'sample',
      version: '1',
      active: true,
    }
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
              const res = o.method(survey, m[1])
              if (res.errCode) errs.push({ lineno, errCode: res.errCode, line })
              else current = res
            }
            got = true
          }
        })
        if (!got) {
          const m = line.match(/^\s*\+([a-z0-9]+)[:=\s]*(.*)$/i)
          if (m) {
            got = true
            const [match, key, value] = m
            if (!current)
              errs.push({
                lineno,
                errCode: 'e-no-obj',
                line,
              })
            else {
              current[key] = value || true
              switch (key) {
                case 'condition':
                  if (typeof value === 'string') current[key] = value.split(/\s+/)
                  break
              }
            }
          }
        }
        if (!got) {
          // Just append the line to the title of the current object
          current.title = `${current.title} ${line}`

          // errs.push({ lineno, errCode: 'e-unk', line })
        }
      }
    })
    if (errs.length) {
      return {
        status: 'failed',
        message: '',
        survey,
        errs: errs.map((err) => ({ error: getError({ code: err.errCode }), ...err })),
      }
    }

    return { status: 'success', message: '', survey }
  } catch (e) {
    return { status: 'exception', message: e.message }
  }
}
