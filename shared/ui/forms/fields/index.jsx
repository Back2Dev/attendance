import React, { useContext } from 'react'
import { connectField } from 'uniforms'
import { AutoField } from 'uniforms-mui'
import JSONField from './json-field'
import SignatureField from './signature-field.jsx'
import DataTableField from './datatable-field'
import HiddenField from './hidden-field'
import IdField from './id-field'

import dbg from 'debug'
const debug = dbg('app:forms')

const myComponent = ({ name, fieldType }) => {
  // console.log({ name, fieldType, rest })
  // console.log(fieldType.name)
  switch (name) {
    case 'description':
      return null
    case 'signature':
      return SignatureField
    case '_id':
    case 'hidden':
      return HiddenField
    case 'id':
      return IdField
    case 'json':
    case 'object':
    case 'Object':
      return JSONField
    case 'table':
      return DataTableField
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

const CustomManualAndAuto = (selector) => {
  const CustomField = (props) => {
    // This way we don't care about unhandled cases - we use default
    // AutoField as a fallback component.
    // debug(props)
    const Component = selector(props) || myComponent(props) || AutoField

    return <Component {...props} name="" />
  }
  return connectField(CustomField, {
    ensureValue: false,
    initialValue: false,
  })
}

export { CustomManualAndAuto }
