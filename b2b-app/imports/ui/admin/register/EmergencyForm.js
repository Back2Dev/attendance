import React from 'react'
import PropTypes from 'prop-types'

import { emergencyFormBridge } from './formSchemas'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import { AutoForm, AutoFields, ErrorsField } from 'uniforms-material'

const useStyles = makeStyles((theme) => ({
  formButtons: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  buttonGroup: {
    float: 'right',
  },
}))

const EmergencyForm = ({ onSubmit, model, onBack }) => {
  const classes = useStyles()

  return (
    <div>
      <AutoForm schema={emergencyFormBridge} onSubmit={onSubmit} model={model}>
        <AutoFields />
        <ErrorsField />
        <div className={classes.buttonGroup}>
          <Button onClick={onBack} className={(classes.formButtons, classes.backButton)}>
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.formButtons}
          >
            Next
          </Button>
        </div>
      </AutoForm>
    </div>
  )
}

EmergencyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
}

export { EmergencyForm }
