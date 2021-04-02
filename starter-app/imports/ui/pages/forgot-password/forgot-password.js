import React, { useContext } from 'react'
import { useHistory, Link as RouterLink } from 'react-router-dom'
import { Grid, Paper, Typography, Link, Button, TextField } from '@material-ui/core'
import {
  AutoForm,
  AutoField,
  ErrorsField,
  SubmitField,
  RadioField,
} from 'uniforms-material'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import log from '/imports/lib/log'

let emailSchema = new SimpleSchema2Bridge(
  new SimpleSchema({
    email: {
      type: String,
    },
  })
)

const ForgotPassword = () => {
  const [submitted, setSubmittted] = React.useState(false)

  const { user } = useContext(AccountContext)

  const submit = (values) => {
    setSubmittted(true)
    Meteor.call('sendResetPasswordEmail', values.email)
  }

  const onLogout = (e) => {
    e.preventDefault()
    Meteor.logout((error) => {
      if (error) {
        showError(error.message)
      } else {
        push('/logged-out')
      }
    })
  }

  const { push } = useHistory()
  const renderForm = () => {
    if (!user && !submitted) {
      return (
        <>
          <AutoForm schema={emailSchema} onSubmit={(values) => submit(values)}>
            <Typography variant="h1">Forgot your password?</Typography>
            <br />
            <Typography>
              Simply fill out the form below. We’ll send a link to the email registered to
              your account.
            </Typography>
            <AutoField name="email" />
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
    } else if (submitted) {
      return (
        <>
          <Typography variant="h1">Email sent</Typography>
          <br />
          <Typography>
            Instructions to reset your password will be sent out to your email address.
          </Typography>
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

export default ForgotPassword
