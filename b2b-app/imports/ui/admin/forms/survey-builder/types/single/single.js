import React from 'react'
import PropTypes from 'prop-types'
import debug from 'debug'

import SingleInner from './inner'
import Frame from '../../frame'
import SimpleSchema from 'simpl-schema'

let log = debug('builder:single')

const schema = new SimpleSchema({
  id: String,
  prompt: String,
  answers: Array,
  'answers.$': Object,
  'answers.$.id': String,
  'answers.$.name': String,
  'answers.$.val': {
    type: String,
    optional: true,
  },
}).newContext()

export const mapDataToAtom = (data) => {
  const state = {
    id: data.id,
    prompt: data.title,
    answers: data.answers.map(({ id, title, val }) => ({ id, name: title, val })),
  }
  schema.validate(state)
  if (!schema.isValid()) {
    log('expected', schema._schema)
    log('got', data)
    throw new Error('Invalid mapping from data to single state')
  }

  return state
}

const Single = ({ pid }) => {
  return (
    <Frame pid={pid}>
      <SingleInner pid={pid} />
    </Frame>
  )
}

Single.propTypes = {
  /** id for this Single instance part */
  pid: PropTypes.string.isRequired,
}

export default Single
