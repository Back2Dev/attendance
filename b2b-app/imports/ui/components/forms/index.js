import React from 'react'
import { connectField } from 'uniforms'
import { AutoField } from 'uniforms-material'
import ToolsField from '/imports/ui/components/forms/tools-selector.js'
import CoursesField from '/imports/ui/components/forms/course-selector.js'
import SlateField from './slate-field'
import EventRepeatField from './event-repeat'
// import JSONField from './json-field'
import SignatureField from './signature-field.js'
import SchemaFieldsEditor from '../../admin/schemas/components/schema-fields-editor'

// const debug = require('debug')('app:forms')

const myComponent = ({ name, fieldType }) => {
  // console.log({ name, fieldType, rest })
  // console.log(fieldType.name)
  switch (name) {
    case 'description':
      if (fieldType.name === 'Array') {
        return SlateField
      } else {
        return null
      }
    case 'tools':
      return ToolsField
    case 'signature':
      return SignatureField
    case 'courseId':
    case 'backupCourseId':
      return CoursesField
    case 'repeat':
      return EventRepeatField
    case 'fields':
      return SchemaFieldsEditor
    default:
      return null
  }
}

const CustomAuto = (props) => {
  // This way we don't care about unhandled cases - we use default
  // AutoField as a fallback component.
  // debug(props)
  const Component = myComponent(props) || AutoField

  return <Component {...props} name="" />
}

export const CustomAutoField = connectField(CustomAuto, {
  ensureValue: false,
  initialValue: false,
})
