import React from 'react'
import PropTypes from 'prop-types'

import { termsFormBridge } from './formSchemas'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { AutoForm } from 'uniforms-material'

const Confirm = ({ onSubmit, model }) => {
  return (
    <div>
      <AutoForm schema={termsFormBridge} onSubmit={onSubmit} model={model}></AutoForm>
    </div>
  )
}

Confirm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
}

export { Confirm }
