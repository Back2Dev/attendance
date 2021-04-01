import React, { useContext } from 'react'
import { useHistory, Link as RouterLink } from 'react-router-dom'
import { Grid, Paper, Typography, Link, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'
import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'

const AddFacebookConfirm = () => {
  const [submitEnabled, setSubmitEnabled] = React.useState(true)

  const { push } = useHistory()
  const { user } = useContext(AccountContext)

  const addGoogle = (facebook) => {
    setSubmitEnabled(false)
    Meteor.call('updateFacebook', facebook, function (err) {
      if (err) {
        showError(err)
        setSubmitEnabled(true)
      } else {
        showSuccess('Added Facebook to your account')
        setSubmitEnabled(true)
        sessionStorage.clear()
        push('/login')
      }
    })
  }

  const facebook = JSON.parse(sessionStorage.getItem('facebook'))

  const renderForm = () => {
    if (!user && facebook && facebook.facebook.email) {
      return (
        <Grid item xs={12} align="center" className="confirm-google">
          <Typography variant="h1">Add Facebook</Typography>
          <br />
          <Typography>
            Account already exists with email: <br /> <b>{facebook.facebook.email}</b>
            <br /> Do you want to add Facebook to your account?
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
                onClick={() => addGoogle(facebook)}
                disabled={!submitEnabled}
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
        <Typography variant="h1">
          Facebook credentials not found, please try again
        </Typography>
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

export default AddFacebookConfirm
