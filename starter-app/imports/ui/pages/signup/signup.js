import React, { useContext, useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { useHistory, Link as RouterLink } from 'react-router-dom'
import { AutoForm, AutoFields, ErrorsField, SubmitField } from 'uniforms-material'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { Grid, Typography, Link, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import GoogleLogin from '/imports/ui/components/google-login/google-login.js'
import FacebookLogin from '/imports/ui/components/facebook-login/facebook-login.js'
import TextDivider from '/imports/ui/components/text-divider.js'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'
import { showError } from '/imports/ui/utils/toast-alerts'

let userSchema = new SimpleSchema2Bridge(
  new SimpleSchema({
    name: { type: String, max: 200 },
    email: {
      type: String,
      max: 200,
      regEx: SimpleSchema.RegEx.EmailWithTLD,
    },
  })
)
// This new code is causing errors
// const emailCheckingTimeout = useRef(null)
// const handleChange = (key, value) => {
//   console.log(key, value)
//   if (key === 'email') {
//     Meteor.clearTimeout(emailCheckingTimeout.current)
//     Meteor.setTimeout(() => {
//       Meteor.call('userExists', value, (err) => {
//         if (err) {
//           showWarning(err.message)
//           setSubmitEnabled(false)
//         } else {
//           setSubmitEnabled(true)
//         }
//       })
//     }, 1000)
//   }
// }

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '50px',
    maxWidth: '450px',
  },
  link: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:visited': {
      color: '#4794fc',
    },
  },
  button: {},
}))

const Signup = () => {
  const [submitEnabled, setSubmitEnabled] = useState(true)

  const classes = useStyles()
  const { push } = useHistory()
  const { user } = useContext(AccountContext)

  const signup = (form) => {
    Object.keys(form).map(
      (key) => (form[key] = typeof form[key] == 'string' ? form[key].trim() : form[key])
    )
    setSubmitEnabled(false)
    Meteor.call('userExists', form.email, function (err) {
      if (err) {
        showError(err.error)
        setSubmitEnabled(true)
      }
    })
    Meteor.call('signup', form, (err) => {
      if (!err) {
        push('/confirmation-sent', { name: form.name })
      }
    })
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

  const renderForm = () => {
    if (!user) {
      return (
        <Grid item xs={12} align="center" className="signup-form">
          <AutoForm schema={userSchema} onSubmit={(e) => signup(e)}>
            <Typography variant="h1">Sign up</Typography>
            <br />
            <GoogleLogin label="Sign up with Google" redirect="/dashboard" />
            <br />
            <FacebookLogin label="Sign up with Facebook" redirect="/dashboard" />
            <br />
            <br />
            <TextDivider>Or</TextDivider>
            <AutoFields />
            <ErrorsField />
            <br />
            By clicking submit you are agreeing to the{' '}
            <a
              href="https://startup.com.au/terms-of-use/"
              className={classes.link}
              target="_blank"
              rel="noreferrer"
            >
              terms and conditions
            </a>
            <br />
            <br />
            <SubmitField
              id="submit-button"
              className={classes.button}
              color="primary"
              variant="contained"
              disabled={!submitEnabled}
              fullWidth
            />
            <br />
            <br />
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" id="login-link">
              Log in here
            </Link>
          </AutoForm>
        </Grid>
      )
    }
  }

  return <OnboardingModal renderForm={renderForm} />
}

export default Signup
