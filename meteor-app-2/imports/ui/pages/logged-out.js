import React, { useContext } from 'react'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { Typography, Link, Button } from '@material-ui/core'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'
import { AccountContext } from '/imports/ui/contexts/account-context.js'

export default function NotFound() {
  const { isLoggedIn, loading } = useContext(AccountContext)

  const renderForm = () => {
    if (!isLoggedIn) {
      return (
        <>
          <Typography variant="h1" data-cy="logged-out">
            You have logged out
          </Typography>
          <br />
          <Link component={RouterLink} to="/">
            Back to homepage
          </Link>
        </>
      )
    } else {
      return (
        <>
          <Typography variant="h1">You are still logged in</Typography>
          <br />
          <Button
            onClick={() => {
              Meteor.logout((error) => {
                if (error) {
                  showError(error.message)
                } else {
                  push('/logged-out')
                }
              })
            }}
            variant="contained"
            color="primary"
          >
            Click here to log out
          </Button>
        </>
      )
    }
  }
  return <OnboardingModal renderForm={renderForm} />
}
