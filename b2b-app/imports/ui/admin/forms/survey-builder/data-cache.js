import keyBy from 'lodash/keyBy'
import mapValues from 'lodash/mapValues'
import debug from 'debug'

import SimpleSchema from 'simpl-schema'
import TypeRegistry from './types/type-registry'

let log = debug('builder:data-cache')
let data = []
let sections = {}
let questions = {}

const schema = new SimpleSchema(
  {
    sections: {
      type: Array,
      minCount: 1,
    },
    'sections.$': Object,
    'sections.$.questions': Array,
    'sections.$.questions.$': Object,
  },
  {
    clean: {
      filter: true,
    },
  }
).newContext()

const parse = (data) => {
  sections = data.reduce((acc, { title, id }) => ({ ...acc, [id]: title }))

  questions = data.reduce(
    (acc, { questions }) => ({
      ...acc,
      ...mapValues(
        keyBy(questions, ({ id }) => id),
        (v) => {
          const type = TypeRegistry.get(v.type)
          // a type hasn't been implemented so just return the original data
          if (!type) {
            return v
          }
          if (!type.mapDataToAtom) {
            throw new Error('Missing mapDataToAtom function')
          }
          return type.mapDataToAtom(v)
        }
      ),
    }),
    {}
  )
}

const set = (parsedJson) => {
  if (!parsedJson) {
    data = []
    sections = {}
    questions = {}
    return
  }
  const clean = schema.clean(parsedJson)
  schema.validate(clean)
  if (!schema.isValid()) {
    log('expected', schema._schema)
    log('got', parsedJson)
    throw new Error('Unexpected data shape')
  }
  data = parsedJson.sections

  parse(data)
}

const get = () => {
  return data ? Object.freeze(data) : null
}

const getParts = () => {
  return data
    .map(({ questions }) =>
      questions.map(({ id, type }) => {
        if (!TypeRegistry.get(type)) {
          return { _id: id, type: 'placeholder' }
        }
        return { _id: id, type }
      })
    )
    .flat()
}

const getQuestion = (id) => {
  return questions[id] ? Object.freeze(questions[id]) : null
}

const dataCache = { set, get, getQuestion, getParts }

export default dataCache
