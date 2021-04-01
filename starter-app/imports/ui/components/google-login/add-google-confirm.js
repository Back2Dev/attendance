import React, { useContext } from 'react'
import { useHistory, Link as RouterLink } from 'react-router-dom'
import { Grid, Paper, Typography, Link, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'
import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'

const useStyles = makeStyles((theme) => ({}))

const AddGoogleConfirm = () => {
  const [submitEnabled, setSubmitEnabled] = React.useState(true)

  const classes = useStyles()
  const { push } = useHistory()
  const { user } = useContext(AccountContext)

  const addGoogle = (google) => {
    Meteor.call('updateGoogle', google, function (err) {
      if (err) {
        showError(err)
      } else {
        showSuccess('Added Google to your account')
        sessionStorage.clear()
        push('/login')
      }
    })
  }

  const google = JSON.parse(sessionStorage.getItem('google'))

  const renderForm = () => {
    if (!user && google && google.google.email) {
      return (
        <Grid item xs={12} align="center" className="confirm-google">
          <Typography variant="h1">Add Google</Typography>
          <br />
          <Typography>
            Account already exists with email: <br /> <b>{google.google.email}</b>
            <br /> Do you want to add Google to your account?
          </Typography>
          <br />
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Button
                id="no-button"
                color="secondary"
                variant="contained"
                onClick={() => push('/login')}
                fullWidth
              >
                No
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                id="yes-button"
                color="primary"
                variant="contained"
                onClick={() => addGoogle(google)}
                fullWidth
              >
                Yes
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )
    }
    return (
      <div className="creds-not-found">
        <Typography variant="h1">Something went wrong</Typography>
        <br />
        <Button
          id="back-to-login"
          variant="contained"
          color="secondary"
          onClick={() => push('/login')}
          fullWidth
        >
          Back to login
        </Button>
      </div>
    )
  }

  return <OnboardingModal renderForm={renderForm} />
}

export default AddGoogleConfirm
