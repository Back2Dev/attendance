import React from 'react'
import PropTypes from 'prop-types'

import { contactFormBridge } from './formSchemas'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { AutoForm } from 'uniforms-material'

const ContactForm = ({ onSubmit, model }) => {
  return (
    <div>
      <AutoForm schema={contactFormBridge} onSubmit={onSubmit} model={model}></AutoForm>
    </div>
  )
}

ContactForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
}

export { ContactForm }
