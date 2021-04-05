import React from 'react'
import { Meteor } from 'meteor/meteor'
import PropTypes from 'prop-types'
import { showError } from '/imports/ui/utils/toast-alerts'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import GoogleButton from 'react-google-button'

const useStyles = makeStyles((theme) => ({
  logo: { width: '18px' },
  button: {},
}))

function GoogleLogin({ label }) {
  const { push, location } = useHistory()

  let redirect = location.pathname
  if (location.pathname === '/login' || location.pathname === '/') {
    redirect = '/dashboard'
  }

  const classes = useStyles()

  return (
    <>
      <GoogleButton
        onClick={() => {
          Meteor.loginWithGoogle(
            {
              requestPermissions: ['email', 'profile'],
            },
            (err) => {
              if (err) {
                if (err.error == 409) {
                  sessionStorage.setItem('google', JSON.stringify(err.details))
                  push('/add-google')
                }
                showError(err)
              } else {
                push(redirect)
              }
            }
          )
        }}
        label={label || 'Sign in with Google'}
        classes={classes.button}
        style={{ width: '100%' }}
      />
    </>
  )
}

GoogleLogin.propTypes = {
  label: PropTypes.string,
}

export default GoogleLogin
