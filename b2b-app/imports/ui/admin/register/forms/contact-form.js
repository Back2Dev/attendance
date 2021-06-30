import React from 'react'
import PropTypes from 'prop-types'

import { Paper } from '@material-ui/core'
import { AutoForm, AutoFields, ErrorsField } from 'uniforms-material'

import { contactFormBridge } from './form-schemas'
import FormNav from './form-nav'

const ContactForm = ({ onSubmit, model, isEditingStep }) => {
  return (
    <Paper style={{ padding: '2rem', paddingBottom: '0', marginBottom: '1rem' }}>
      <AutoForm schema={contactFormBridge} onSubmit={onSubmit} model={model}>
        <AutoFields />
        <ErrorsField />
        <FormNav isEditingStep={isEditingStep} />
      </AutoForm>
    </Paper>
  )
}

ContactForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  isEditingStep: PropTypes.bool.isRequired,
}

export { ContactForm }
