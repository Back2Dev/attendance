import { createTypeErrorMsg } from 'pdf-lib'

const debug = require('debug')('app:forms:engine')

let survey = { sections: [] }
let currentSection
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
  if (!currentSection) addSection(survey, 'Section 1')
  currentQ = { prompt, answers: [], id: slugify(prompt), type: 'short' }
  currentSection.questions.push(currentQ)
  return currentQ
}

const addSection = (survey, title) => {
  currentSection = { title, questions: [], id: slugify(title) }
  survey.sections.push(currentSection)
  return currentSection
}

const addGrid = (survey, title) => {
  currentGrid = { title, questions: [], id: slugify(title) }
  return currentGrid
}

const addAnswer = (survey, text) => {
  currentA = { text, id: slugify(text) }
  currentQ.answers.push(currentA)
  return currentA
}

const objects = [
  { name: 'Question', letters: 'QT', method: addQ },
  { name: 'Grid', letters: 'G', method: addGrid },
  { name: 'Answer', letters: 'A', method: addAnswer },
  { name: 'Section', letters: 'S', method: addSection },
]

objects.forEach((o) => {
  o.regex = new RegExp(`^\\s*[${o.letters}][:\\s=]+(.*)\$`, 'i')
})

export const parse = (source) => {
  if (typeof source !== 'string') throw new Error('Parameter to parse must be a string')
  try {
    survey = { sections: [] }
    const result = { status: 'failed', errs: [] }
    const lines = source.split('\n')
    lines.forEach((line, ix) => {
      const lineno = ix + 1
      // COMMENT
      debug(`${lineno}: ${line}`)
      if (line && !line.match(/^\s*#/)) {
        let got = false
        objects.forEach((o) => {
          const m = line.match(o.regex)
          // debug(o.regex.toString(), m)
          if (m) {
            debug(`${o.name}: ${m[1]}`)
            if (o.method) {
              current = o.method(survey, m[1])
            }
            got = true
          }
        })
        if (!got) {
          const m = line.match(/^\s*\+([a-z0-9]+)[:=\s]+(.*)$/i)
          if (m) {
            got = true
            const [match, key, value] = m
            current[key] = value
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
