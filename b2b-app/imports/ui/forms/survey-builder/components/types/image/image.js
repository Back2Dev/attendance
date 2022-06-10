import React from 'react'
import PropTypes from 'prop-types'
import debug from 'debug'
import { InnerImage } from './inner'
import { Frame } from '../../frame'
import SimpleSchema from 'simpl-schema'
import { imageAtom, imageSource } from '../../../recoil/atoms'
import { TypeRegistry } from '../type-registry'
import { Inspector } from '/imports/ui/forms/survey-builder/components/panels'
import {
  useSelectedPartValue,
  useImageAnswers,
} from '/imports/ui/forms/survey-builder/recoil/hooks'

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
    // throw new Error('Invalid mapping from data to single state')
  }
  return state
}

const Image = ({ pid, index }) => {
  const { all, add } = useImageAnswers(pid)
  return (
    <Frame pid={pid} index={index} onAdd={() => add(all.length - 1)}>
      <InnerImage pid={pid} />
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

Image.displayName = 'Image'

Image.propTypes = {
  /** id for this Single instance part */
  pid: PropTypes.string.isRequired,
  /** the position this question is rendered in the parts list */
  index: PropTypes.number,
}

export { Image }

TypeRegistry.register(
  'image',
  Image,
  imageSource,
  mapDataToAtom,
  imageAtom,
  InspectorProperties
)
