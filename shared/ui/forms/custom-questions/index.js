import React from 'react'
import { AutoField, AutoForm, LongTextField, ErrorField, SubmitField } from 'uniforms-mui'

import Q3Question from './ekit-q3'
import DpaSerial from './dpa-serial'
// Wrapper component for custom questions

const CustomQuestion = (q, ix, model, formData) => {
  switch (q.custom) {
    case 'none':
      return ''
      break
    case 'ekit-q3':
      return Q3Question(q, ix, model, formData)
      break
    case 'dpa-serial':
      return DpaSerial(q, ix, model, formData)
      break
    default:
      return <div>Could not find custom question for [{q.custom}]</div>
  }
}

export default CustomQuestion
