import React from 'react'
import { Typography } from '@material-ui/core'
import { useLocation } from 'react-router-dom'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'

const confirmMessage = {
  title: 'Check your email',
  body: (
    <>
      Thank you for registering to use Back2bikes.
      <br />
      <br />
      Before we get started, we'll just need to verify your email address.
      <br />
      <br />
      We have sent an email to complete your registration. <br />
      <br />
      Please check your email account, including spam or junk folders so we can get the
      ball rolling.
    </>
  ),
}

const ConfirmationSent = () => {
  const location = useLocation()

  const name = (location.state && location.state.name) || 'there,'

  const renderForm = () => {
    return (
      <>
        <Typography variant="h1" data-cy="confirmation" color="primary">
          {confirmMessage.title}
        </Typography>
        <br />
        <Typography variant="h2" align="left">
          Welcome {name.split(' ')[0]}.
        </Typography>
        <br />
        <Typography align="left">{confirmMessage.body}</Typography>
      </>
    )
  }

  return <OnboardingModal renderForm={renderForm} style={{ width: '600px' }} />
}

export default ConfirmationSent
