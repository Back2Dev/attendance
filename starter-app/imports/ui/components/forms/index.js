import React from 'react'
import PropTypes from 'prop-types'
import { connectField } from 'uniforms'
import { AutoForm, AutoField, TextField, LongTextField } from 'uniforms-material'
import JSONField from '/imports/ui/components/forms/json-field'

const debug = require('debug')('b2b:forms')

const myComponent = ({ fieldType }) => {
  if (fieldType.name === 'Object') return JSONField
  return null
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
