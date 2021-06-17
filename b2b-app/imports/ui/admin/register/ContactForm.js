import React from 'react'
import PropTypes from 'prop-types'

import { contactFormBridge } from './formSchemas'

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

const ContactForm = ({ onSubmit, model }) => {
  const classes = useStyles()

  return (
    <div>
      <AutoForm schema={contactFormBridge} onSubmit={onSubmit} model={model}>
        <AutoFields />
        <ErrorsField />
        <div className={classes.buttonGroup}>
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

ContactForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
}

export { ContactForm }
