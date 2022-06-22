import keyBy from 'lodash/keyBy'
import mapValues from 'lodash/mapValues'
import debug from 'debug'

import SimpleSchema from 'simpl-schema'
import { TypeRegistry } from './components/types/type-registry'

let log = debug('builder:data-cache')
let data = []
let sections = {}
let questions = {}
let parts = {}

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
  //if data from text editor don't have paragraph , then set default to ''
  sections = data.reduce(
    (acc, { name, title, id, p }) => ({
      ...acc,
      [id]: { name: name || title, id, p: p ?? '' },
    }),
    {}
  )

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

  parts = data.reduce(
    (acc, { id, questions, lineno, object, ...props }) => ({
      ...acc,
      [id]: { type: 'section', ...props, _id: id },
      ...questions.reduce(
        (acc, { id, type, answers, lineno, object, grid, ...props }) => ({
          ...acc,
          [id]: {
            _id: id,
            type,
            answers: answers.map(({ lineno, object, ...props }) => ({ ...props })),
            ...props,
          },
        }),
        {}
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
  // return data
  //   .map(({ questions }) =>
  //     questions.map(({ id, type }) => {
  //       const config = TypeRegistry.get(type)
  //       if (!config) {
  //         return { _id: id, config: TypeRegistry.get('placeholder') }
  //       }
  //       return { _id: id, config }
  //     })
  //   )
  //   .flat()
  return data.reduce(
    (acc, { id, questions, lineno, object, ...props }) => [
      ...acc,
      {
        _id: id,
        type: 'section',
        ...props,
      },
      ...questions.map(({ id, answers, lineno, object, grid, ...props }) => {
        return {
          _id: id,
          answers: answers.map(({ lineno, object, ...props }) => ({ ...props })),
          ...props,
        }
      }),
    ],
    []
  )
}

const getPart = (id) => {
  return parts[id] ? Object.freeze(parts[id]) : null
}

const getQuestion = (id) => {
  return questions[id] ? Object.freeze(questions[id]) : null
}

const getSection = (id) => {
  return sections[id] ? Object.freeze(sections[id]) : null
}

const dataCache = { set, get, getQuestion, getParts, getSection, getPart }

export { dataCache }
