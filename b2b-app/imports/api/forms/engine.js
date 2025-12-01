import { getError } from './engine-errors'
import keywords from './engine-keywords'

const debug = require('debug')('app:forms:engine')

const validQtypes =
  'multiple single text array slider paragraph signature calc lookup dropdown rating tree geolocation scale date file table upload short'.split(
    /\s+/
  )
const aliases = { type: { file: 'upload', short: 'text', num: 'number' } }
// Additional types (which alias back to text)
const textQtypes = 'email password mobile address long date'.split(/[\s,]+/)
const allQtypes = validQtypes.concat(textQtypes)
const noAnswers = 'paragraph'.split(/\s+/)
let survey = { sections: [] }
let currentStep
let currentQ
let current
let errs
let currentA

const slugify = (text) => {
  if (!text || typeof text !== 'string') return 'no-slug'
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '');
}

const convert = { BQ: 'blockquote', HREF: 'a' }

const addElement = (survey, matches, lineno) => {
  const [orig, close, key, title] = matches
  const tag = convert[key] || key.toLowerCase()
  const el = { tag, contents: title, close: !!close }
  if (current && current.object === 'question') {
    current.elements.push(el)
    return current
  } else {
    currentQ = {
      title,
      elements: [el],
      answers: [],
      grid: [],
      type: 'text',
      // object: 'question',
      lineno,
    }
    currentStep.questions.push(currentQ)
    return currentQ
  }
}

const addQ = (survey, matches, lineno) => {
  const title = matches[2]
  const tag = 'span'
  const el = { tag, contents: title }
  if (!currentStep) addStep(survey, `Section ${survey.sections.length + 1}`, 1)
  if (current && !current.object) {
    current.title = title
    current.question = title
    current.id = slugify(title)
    if (current.elements) current.elements.push(el)
    else current.elements = [el]
    return current
  } else {
    currentQ = {
      title,
      question: title,
      elements: [el],
      answers: [],
      grid: [],
      id: slugify(title),
      type: 'text',
      object: 'question',
      lineno,
    }
    currentStep.questions.push(currentQ)
  }
  return currentQ
}

const addStep = (survey, matches, lineno) => {
  const title = matches[2]
  currentStep = {
    title: title || `Section ${survey.sections.length + 1}`,
    questions: [],
    id: slugify(title),
    object: 'step',
    lineno,
  }
  survey.sections.push(currentStep)
  return currentStep
}

const addGrid = (survey, matches, lineno) => {
  const title = matches[2]
  currentGrid = { title, id: slugify(title), object: 'grid', lineno }
  currentQ.grid.push(currentGrid)
  return currentGrid
}

const addAnswer = (survey, matches, lineno) => {
  const text = matches[2]
  currentA = { title: text, id: slugify(text), type: 'text', object: 'answer', lineno }
  if (textQtypes.includes(currentQ.type)) {
    currentA.type = currentQ.type
    currentQ.type = 'text'
  }
  if (!currentQ) {
    return { errCode: 'e-no-ans' }
  } else currentQ.answers.push(currentA)
  return currentA
}

const objects = [
  {
    name: 'Element',
    letters:
      'H6 H1 H2 H3 H4 H5 P UL OL LI BR HR IMG BQ BLOCKQUOTE HREF TABLE TR TH TD TBODY'.split(
        /[\s,]+/
      ),
    convert: { BQ: 'blockquote', HREF: 'a' },
    method: addElement,
    keywords: keywords.element,
  },
  {
    name: 'Question',
    letters: 'QT',
    method: addQ,
    keywords: keywords.question.concat(keywords.additional),
  },
  { name: 'Grid', letters: 'G', method: addGrid, keywords: keywords.grid },
  { name: 'Answer', letters: 'A', method: addAnswer, keywords: keywords.answer },
  { name: 'Step', letters: 'S', method: addStep, keywords: keywords.step },
]

const findObject = (name) => objects.find((o) => o.name.toLowerCase() === name)

objects.forEach((o) => {
  if (Array.isArray(o.letters))
    o.regex = new RegExp(`^\\s*([\/]*)(${o.letters.join('|')})[:\\s=]*(.*)\$`, 'i')
  else o.regex = new RegExp(`^\\s*([${o.letters}])[:\\s=]+(.*)\$`, 'i')
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
              const res = o.method(survey, m, lineno, line)
              if (res.errCode) errs.push({ lineno, errCode: res.errCode, line })
              else current = res
            }
            got = true
          }
        })
        if (!got && line.match(/^\s*[a-z][:\s=]/i))
          errs.push({ lineno, errCode: 'e-bad-letter', line })
        if (!got) {
          const m = line.match(/^\s*\+\s*([a-z0-9]+)\s*[:=]*\s*(.*)$/i)
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
              const obj = findObject(current.object) || []
              if (!obj?.keywords?.includes(key))
                errs.push({ lineno, errCode: 'e-unk-attrib', line })
              current[key] = value || true
              switch (key) {
                case 'condition':
                  if (typeof value === 'string') current[key] = value.split(/\s+/)
                  break
              }
            }
          } else {
            // debug('no attr', line)
            // It didn't exactly match, but if the line started with a "+", report an error"
            if (line.match(/^\s*\+/)) errs.push({ lineno, errCode: 'w-bad-option', line })
          }
        }
        if (!got) {
          // Just append the line to the title of the current object
          current.title = `${current.title} ${line}`

          // errs.push({ lineno, errCode: 'e-unk', line })
        }
      }
    })
    // Resolve aliases
    survey.sections.forEach((section) => {
      section.questions.forEach((q) => {
        Object.keys(aliases).forEach((key) => {
          if (q[key] && aliases[key][q[key]]) q[key] = aliases[key][q[key]]
        })
        q.answers.forEach((a) => {})
      })
    })
    // Some post-checking for consistency
    survey.sections.forEach((section) => {
      if (section.id === 'no-slug')
        errs.push({ lineno: section.lineno, errCode: 'w-missing-title' })
      section.questions.forEach((q) => {
        if (!allQtypes.includes(q.type))
          errs.push({ lineno: q.lineno, errCode: 'w-unk-type', line: q.type })
        if (noAnswers.includes(q.type) && q.answers.length)
          errs.push({
            lineno: q.answers[0].lineno,
            errCode: 'w-ignore-attribs',
            line: q.type,
          })
        if (q.elements) {
          q.prompt = new DOMParser().parseFromString(
            q.elements
              .map((el) => {
                el.contents = el.contents?.trim() || ''
                if (el.close) return `</${el.tag}>`
                return el.contents
                  ? `<${el.tag}>${el.contents}</${el.tag}>`
                  : `<${el.tag} />`
              })
              .join(''),
            'text/html'
          ).body.innerHTML
          console.log({ prompt: q.prompt })
          // q.prompt = q.elements
          //   .map((el) => {
          //     el.contents = el.contents?.trim() || ''
          //     return el.contents
          //       ? `<${el.tag}>${el.contents}</${el.tag}>`
          //       : `<${el.tag} />`
          //   })
          //   .join('')
        }
      })
    })
    if (errs.length) {
      debug('Houston, we have problems...', errs)
      return {
        status: 'failed',
        message: '',
        survey,
        errs: errs.map((err) => ({ error: getError({ code: err.errCode }), ...err })),
      }
    }

    return { status: 'success', message: '', survey }
  } catch (e) {
    console.error(e)
    return { status: 'exception', message: `Error in parse: ${e.message}` }
  }
}
