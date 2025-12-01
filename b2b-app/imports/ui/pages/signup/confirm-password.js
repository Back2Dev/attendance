import React from 'react'
import { AutoForm, AutoField, ErrorsField, SubmitField } from 'uniforms-mui'
import { Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate, useParams } from 'react-router-dom'
import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'
import PasswordBridge from '/imports/ui/utils/password-validation/password-bridge.js'
import PasswordValidator from '/imports/ui/utils/password-validation/password-validator.js'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'

const passwordSchema = {
  password: { type: String, label: 'New password' },
  confirmPassword: {
    type: String,
    label: 'Confirm password',
  },
}

const bridge = new PasswordBridge(passwordSchema, PasswordValidator)

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '50px',
    maxWidth: '450px',
  },
}))

const ConfirmPassword = () => {
  const [submitEnabled, setSubmitEnabled] = React.useState(true)
  const classes = useStyles()
  const navigate = useNavigate()
  const { userId, token } = useParams()

  const add = (form) => {
    form.userId = userId
    form.token = token
    Meteor.call('verifyUser', form, function (err) {
      if (err) {
        showError(err)
      } else {
        showSuccess('Added password')
        Meteor.loginWithPassword({ id: userId }, form.password, (error) => {
          if (error) {
            showError(error.message)
          } else {
            navigate('/dashboard')
          }
        })
      }
    })
  }

  const renderForm = () => {
    return (
      <AutoForm schema={bridge} onSubmit={(e) => add(e)}>
        <Typography variant="h1">Account Verification</Typography>
        <Typography>Please create a password to verify your email</Typography>
        <AutoField name="password" type="password" />
        <AutoField name="confirmPassword" type="password" />
        <ErrorsField />
        <br />
        <br />
        <SubmitField
          id="submit-button"
          color="primary"
          variant="contained"
          disabled={!submitEnabled}
          fullWidth
        />
      </AutoForm>
    )
  }

  return <OnboardingModal renderForm={renderForm} />
}

export default ConfirmPassword
