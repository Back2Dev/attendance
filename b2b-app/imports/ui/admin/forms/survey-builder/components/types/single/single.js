import React from 'react'
import PropTypes from 'prop-types'
import debug from 'debug'

import { SingleInner } from './inner'
import { Frame } from '../../frame'
import SimpleSchema from 'simpl-schema'
import { singleAtom, singleSource } from '../../../recoil/atoms'
import { TypeRegistry } from '../type-registry'

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

const mapDataToAtom = (data) => {
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

const Single = ({ pid, index }) => {
  return (
    <Frame pid={pid} index={index}>
      <SingleInner pid={pid} />
    </Frame>
  )
}

Single.displayName = 'Single'

Single.propTypes = {
  /** id for this Single instance part */
  pid: PropTypes.string.isRequired,
  /** the position this question is rendered in the parts list */
  index: PropTypes.number,
}

export { Single }

TypeRegistry.register('single', Single, singleSource, mapDataToAtom, singleAtom)
