import React from 'react'
import { AutoForm } from 'uniforms-mui'
// EKit
import { form as Q3Form, validator as Q3Validator } from './ekit/ekit-q3-form'
import Q3Bridge from './ekit/ekit-q3-bridge'
// DPA
import { form as DpaSerialForm } from './dpa/dpa-serial-form'

// Wrapper component for custom forms

const TheForm = ({ form, ...rest }) => {
  switch (form) {
    // This one wasn't completed - not sure what the intention was
    case 'ekit-q3':
      return <Q3Form bridge={Q3Bridge} validator={Q3Validator} {...rest} />
      break
    // This one is simpler, and the form includes it's own bridge,
    // so it's much cleaner
    case 'dpa-serial':
      return <DpaSerialForm {...rest} />
      break
    default:
      return <div>Could not find custom form for [{form}]</div>
  }
}

// THIS IS NOT USED (YET) - custom questions are the go!

const CustomForm = ({ children, formData, form, ...rest }) => {
  return (
    <AutoForm {...rest}>
      <TheForm form={form} formData={formData} {...rest}></TheForm>
      {children}
    </AutoForm>
  )
}

export const validators = { 'ekit-q3': Q3Validator }
export const bridges = { 'ekit-q3': Q3Bridge }

export default CustomForm
