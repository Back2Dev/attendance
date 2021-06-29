import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import { Button, Paper } from '@material-ui/core'
import { AutoForm, AutoFields, ErrorsField } from 'uniforms-material'

import { aboutFormBridge } from './form-schemas'

const useStyles = makeStyles((theme) => ({
  formButtons: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
}))

const AboutForm = ({ onSubmit, model, onBack }) => {
  const classes = useStyles()

  return (
    <Paper style={{ padding: '2rem', paddingBottom: '0', marginBottom: '1rem' }}>
      <AutoForm schema={aboutFormBridge} onSubmit={onSubmit} model={model}>
        <AutoFields />
        <ErrorsField />
        <div className={classes.buttonGroup}>
          <div style={{ direction: 'rtl' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.formButtons}
            >
              Submit
            </Button>
            <Button
              onClick={onBack}
              className={(classes.formButtons, classes.backButton)}
            >
              Back
            </Button>
          </div>
        </div>
      </AutoForm>
    </Paper>
  )
}

AboutForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
}

export { AboutForm }
