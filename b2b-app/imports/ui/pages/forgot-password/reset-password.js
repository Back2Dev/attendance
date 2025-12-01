import React, { useContext } from 'react'
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom'
import { Grid, Paper, Typography, Link, Button, TextField } from '@mui/material'
import { AutoForm, AutoField, ErrorsField, SubmitField } from 'uniforms-mui'
import PasswordBridge from '/imports/ui/utils/password-validation/password-bridge.js'
import PasswordValidator from '/imports/ui/utils/password-validation/password-validator.js'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'

const passwordSchema = {
  password: { type: String, label: 'New password' },
  confirmPassword: {
    type: String,
    label: 'Confirm password',
  },
}

const bridge = new PasswordBridge(passwordSchema, PasswordValidator)

const ResetPassword = () => {
  const { userId, token } = useParams()
  const [submitted, setSubmittted] = React.useState(false)
  const { user } = useContext(AccountContext)

  const navigate = useNavigate()

  const submit = (values) => {
    setSubmittted(true)
    Meteor.call('resetUserPassword', values.password, userId, token, (err, data) => {
      if (err) {
        setSubmittted(false)
        showError(err)
      } else {
        navigate('/login')
        showSuccess('Password was changed')
      }
    })
  }

  const onLogout = (e) => {
    e.preventDefault()
    Meteor.logout((error) => {
      if (error) {
        showError(error.message)
      } else {
        navigate('/logged-out')
      }
    })
  }

  const renderForm = () => {
    if (!user) {
      return (
        <>
          <AutoForm schema={bridge} onSubmit={(values) => submit(values)}>
            <Typography variant="h1">Reset your password</Typography>
            <AutoField name="password" type="password" fullWidth />
            <AutoField name="confirmPassword" type="password" fullWidth />
            <ErrorsField />
            <br />
            <br />
            <SubmitField
              id="submit-button"
              color="primary"
              variant="contained"
              disabled={submitted}
              fullWidth
            >
              Submit
            </SubmitField>
          </AutoForm>
        </>
      )
    }
    return (
      <div className="logout-form">
        <Typography variant="h1" color="inherit" noWrap>
          Account
        </Typography>
        <p>You are logged in</p>
        <div className="center-align">
          <Button
            variant="contained"
            color="primary"
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    )
  }

  return <OnboardingModal renderForm={renderForm} />
}

export default ResetPassword
