import React from 'react'
import PropTypes from 'prop-types'
import debug from 'debug'
import { UploadInner } from './inner'
import { Frame } from '$sb/components/frame'
import SimpleSchema from 'simpl-schema'
import { uploadAtom, uploadSource } from '$sb/recoil/atoms'
import { TypeRegistry } from '$sb/components/types/type-registry'
import { Inspector } from '/imports/ui/forms/survey-builder/components/panels'
import { EditProperty } from './inspector-upload'
import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { QuestionProperty } from '/imports/ui/forms/survey-builder/components/panels/inspector/edit-property'

let log = debug('builder:upload')

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

const Upload = ({ pid, index }) => {
  const hide = ['add']
  return (
    <Frame pid={pid} index={index} hide={hide}>
      <UploadInner pid={pid} />
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
      <Inspector.Section heading="Question">
        <QuestionProperty pid={selectedPart} />
      </Inspector.Section>
      <Inspector.Section heading="File">
        <EditProperty pid={selectedPart} path="answers" relabel={relabelAnswers} />
      </Inspector.Section>
    </div>
  )
}

Upload.displayName = 'Upload'

Upload.propTypes = {
  /** id for this Single instance part */
  pid: PropTypes.string.isRequired,
  /** the position this question is rendered in the parts list */
  index: PropTypes.number,
}

export { Upload }

TypeRegistry.register(
  'upload',
  Upload,
  uploadSource,
  mapDataToAtom,
  uploadAtom,
  InspectorProperties
)
