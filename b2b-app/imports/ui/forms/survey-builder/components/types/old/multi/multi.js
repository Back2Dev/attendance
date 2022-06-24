import React from 'react'
import PropTypes from 'prop-types'
import debug from 'debug'

import { MultiInner } from './inner'
import { Frame } from '$sb/components/frame'
import SimpleSchema from 'simpl-schema'
import { multiAtom, multiSource } from '$sb/recoil/atoms'
import { TypeRegistry } from '$sb/components/types/type-registry'
import { Inspector } from '/imports/ui/forms/survey-builder/components/panels'
import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'

let log = debug('builder:multi')

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
    throw new Error('Invalid mapping from data to multi state')
  }

  return state
}

const Multi = ({ pid, index }) => {
  return (
    <Frame pid={pid} index={index}>
      <MultiInner pid={pid} />
    </Frame>
  )
}

const InspectorProperties = () => {
  const selectedPart = useSelectedPartValue()
  const relabelAnswers = (path) => {
    if (path.endsWith('name')) return 'Label'
    if (path.endsWith('val')) return 'Value'
    return 'Id'
  }
  return (
    <div>
      <Inspector.Property pid={selectedPart} path="id" relabel="Question Id" />
      <Inspector.Section heading="Answers">
        <Inspector.Property pid={selectedPart} path="answers" relabel={relabelAnswers} />
      </Inspector.Section>
    </div>
  )
}

Multi.displayName = 'Multi'

Multi.propTypes = {
  /** id for this Multi instance part */
  pid: PropTypes.string.isRequired,
  /** the position this question is rendered in the parts list */
  index: PropTypes.number,
}

export { Multi }

TypeRegistry.register(
  'multi',
  Multi,
  multiSource,
  mapDataToAtom,
  multiAtom,
  InspectorProperties
)
