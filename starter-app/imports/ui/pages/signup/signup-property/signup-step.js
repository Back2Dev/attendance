import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Typography, Button, Grid } from '@material-ui/core'
import { connectField } from 'uniforms'
import {
  AutoForm,
  AutoField,
  ErrorsField,
  SubmitField,
  ValidatedForm,
} from 'uniforms-material'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import GoogleLogin from '/imports/ui/components/google-login/google-login.js'
import FacebookLogin from '/imports/ui/components/facebook-login/facebook-login.js'
import MaterialPhoneNumber from '/imports/ui/components/mui-phone-number.js'
import TextDivider from '/imports/ui/components/text-divider.js'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import { showError } from '/imports/ui/utils/toast-alerts'

let userSchema = new SimpleSchema2Bridge(
  new SimpleSchema({
    name: { type: String, max: 200 },
    email: {
      type: String,
      max: 200,
      regEx: SimpleSchema.RegEx.EmailWithTLD,
    },
    mobile: {
      type: String,
      min: 6,
      max: 50,
      regEx: SimpleSchema.RegEx.Phone,
      uniforms: {
        component: MaterialPhoneNumber,
      },
    },
  })
)

const SignupStep = ({ activeStep, setActiveStep }) => {
  const { user } = useContext(AccountContext)

  const toUploadContract = (form) => {
    Object.keys(form).map(
      (key) => (form[key] = typeof form[key] == 'string' ? form[key].trim() : form[key])
    )
    Meteor.call('userExists', form.email, function (err) {
      if (err) {
        showError(err)
      } else {
        sessionStorage.setItem('userDetails', JSON.stringify(form))
        setActiveStep(activeStep + 1)
      }
    })
  }

  const prefilled = sessionStorage.getItem('userDetails')
    ? JSON.parse(sessionStorage.getItem('userDetails'))
    : {}

  const renderForm = () => {
    if (!user) {
      return (
        <>
          <GoogleLogin label="Sign up with Google" />
          <br />
          <FacebookLogin label="Sign up with Facebook" />
          <br />
          <br />
          <AutoForm
            schema={userSchema}
            onSubmit={(e) => toUploadContract(e)}
            model={prefilled}
          >
            <TextDivider>Or</TextDivider>
            <AutoField name="name" />
            <AutoField name="email" />
            <br />
            <br />
            <AutoField name="mobile" defaultValue={prefilled.mobile} />
            <ErrorsField />
            <br />
            <br />
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => setActiveStep(activeStep - 1)}
                  fullWidth
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={6}>
                <SubmitField
                  id="next-button"
                  color="primary"
                  variant="contained"
                  fullWidth
                >
                  Next
                </SubmitField>
              </Grid>
            </Grid>
          </AutoForm>
        </>
      )
    } else {
      sessionStorage.removeItem('userDetails')
      return (
        <>
          <Typography>You are logged in, please move to the next step</Typography>
          <br />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => setActiveStep(activeStep - 1)}
                fullWidth
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                id="next-button"
                color="primary"
                variant="contained"
                onClick={() => setActiveStep(activeStep + 1)}
                fullWidth
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </>
      )
    }
  }
  return (
    <>
      <Typography variant="h1" data-cy="signup">
        Signup
      </Typography>
      <br />
      {renderForm()}
    </>
  )
}

SignupStep.propTypes = {}

export default SignupStep
