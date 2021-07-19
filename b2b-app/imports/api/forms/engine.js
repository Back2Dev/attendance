const debug = require('debug')('app:forms:engine')

export const dummyParse = (source) => {
  return {
    object: {
      questions: [
        {
          prompt: 'Personal details',
          answers: [
            { text: 'Name' },
            { text: 'Email', type: 'email' },
            { text: 'Mobile', type: 'mobile' },
          ],
        },
      ],
    },
    status: 'success',
  }
}

export const parse = (source) => {
  if (typeof source !== 'string') throw new Error('Parameter to parse must be a string')
  const result = { status: 'failed', object: { questions: [] } }
  const lines = source.split('\n')
  let newQ
  lines.forEach((line, ix) => {
    const lineno = ix + 1
    if (!line.match(/^#/)) {
      let m = line.match(/^\s*Q (.*)$/)
      if (m) {
        debug(`Question: ${m[1]}`)
        newQ = { prompt: m[1], answers: [] }
        result.object.questions.push(newQ)
      }
      m = line.match(/^\s*A (.*)$/)
      if (m) {
        newQ.answers.push({ text: m[1] })
      }
    }
  })

  return result
}
