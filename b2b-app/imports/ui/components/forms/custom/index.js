import React from 'react'
import TableForm from './table-form'
// Wrapper component for custom forms

const CustomForm = ({ form, ...rest }) => {
  switch (form) {
    case 'ekit-q3':
      return <TableForm {...rest}></TableForm>
      break
    default:
      return <div>Could not find custom form for [{form}]</div>
  }
}

export default CustomForm
