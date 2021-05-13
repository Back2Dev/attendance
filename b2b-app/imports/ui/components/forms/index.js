import React from 'react'
import { connectField } from 'uniforms'
import { AutoField } from 'uniforms-material'
import ToolsField from '/imports/ui/components/forms/tools-selector.js'
import CoursesField from '/imports/ui/components/forms/course-selector.js'

const debug = require('debug')('b2b:forms')

const myComponent = ({ name, ...rest }) => {
  // console.log({ name, rest })
  switch (name) {
    // case 'Slate':
    //   return SlateField
    case 'tools':
      return ToolsField
    case 'courseId':
    case 'backupCourseId':
      return CoursesField
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
