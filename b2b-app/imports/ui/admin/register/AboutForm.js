import React from 'react'
import PropTypes from 'prop-types'

import { aboutFormBridge } from './formSchemas'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { AutoForm } from 'uniforms-material'

const AboutForm = ({ onSubmit, model }) => {
  return (
    <div>
      <AutoForm schema={aboutFormBridge} onSubmit={onSubmit} model={model}></AutoForm>
    </div>
  )
}

AboutForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
}

export { AboutForm }
