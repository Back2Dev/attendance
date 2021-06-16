import React from 'react'
import PropTypes from 'prop-types'

import { emergencyFormBridge } from './formSchemas'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { AutoForm } from 'uniforms-material'

const EmergencyForm = ({ onSubmit, model }) => {
  return (
    <div>
      <AutoForm schema={emergencyFormBridge} onSubmit={onSubmit} model={model}></AutoForm>
    </div>
  )
}

EmergencyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
}

export { EmergencyForm }
