import React from 'react'
import PropTypes from 'prop-types'
import { showError } from '/imports/ui/utils/toast-alerts'
import { useHistory } from 'react-router-dom'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  button: {
    height: '50px',
    fontSize: '16px',
    position: 'relative',
    '& .MuiButton-startIcon': {
      position: 'absolute',
      left: 17,
    },
  },
  logo: {
    width: '25px',
  },
  buttonText: {
    marginLeft: '80px',
  },
}))

const FacebookButtonStyle = withStyles((theme) => ({
  root: {
    color: '#FFF',
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
    '&:hover': {
      backgroundColor: '#4794fc',
    },
    '&:disabled': {
      backgroundColor: '#f0efee',
    },
    buttonText: {
      marginRight: '80px',
    },
  },
}))(Button)

export const FacebookButton = ({
  onClick,
  children,
  alignCenter = false,
  disabledProp = false,
}) => {
  const classes = useStyles()

  return (
    <FacebookButtonStyle
      variant="outlined"
      className={classes.button}
      onClick={() => onClick()}
      startIcon={<img src="/images/f_logo_RGB-White_58.png" className={classes.logo} />}
      disabled={disabledProp}
      fullWidth
    >
      <div className={alignCenter ? null : classes.buttonText}>{children}</div>
    </FacebookButtonStyle>
  )
}

function FacebookLogin({ label = 'Sign in with Facebook' }) {
  const { push, location } = useHistory()

  let redirect = location.pathname
  if (location.pathname === '/login' || location.pathname === '/') {
    redirect = '/dashboard'
  }

  return (
    <FacebookButton
      onClick={() =>
        Meteor.loginWithFacebook(
          {
            requestPermissions: ['email', 'public_profile'],
          },
          (err) => {
            if (err) {
              if (err.error == 409) {
                sessionStorage.setItem('facebook', JSON.stringify(err.details))
                push('/add-facebook')
              }
              showError(err)
            } else {
              push(redirect)
            }
          }
        )
      }
    >
      {label}
    </FacebookButton>
  )
}

FacebookLogin.propTypes = {
  label: PropTypes.string,
}

export default FacebookLogin
