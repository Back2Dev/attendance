import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import { useHistory, Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

import { Grid, Button, Typography, TextField, Link } from '@material-ui/core'

import { showError } from '/imports/ui/utils/toast-alerts'
import GoogleLogin from '/imports/ui/components/google-login/google-login.js'
import FacebookLogin from '/imports/ui/components/facebook-login/facebook-login.js'
import TextDivider from '/imports/ui/components/text-divider.js'

const StyledLoginForm = styled.div``

function LoginForm({ doingLogin, setDoingLogin, onAfterLogin }) {
  const { location } = useHistory()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  // const onRegister = (e) => {
  //   e.preventDefault();
  //   history.push('/account/register');
  // };

  const onLogin = (e) => {
    e.preventDefault()

    if (doingLogin) {
      return
    }

    setDoingLogin(true)
    Meteor.loginWithPassword(login, password, (error) => {
      setDoingLogin(false)
      if (error) {
        showError('Email or password was incorrect')
      } else {
        // send user to redirect url
        onAfterLogin()
      }
    })
  }

  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      onLogin(e)
    }
  }

  // console.log(this.context);
  const forgotPasswordLink = (
    <Link
      data-cy="forgot-password"
      component={RouterLink}
      to="/forgot"
      className="forgot-password-link"
    >
      Forgot your password?
    </Link>
  )
  return (
    <StyledLoginForm>
      <Typography variant="h1" data-cy="login" color="inherit" noWrap>
        Log in
      </Typography>
      <br />
      <form className="login-form">
        <Grid container>
          <Grid item xs={12}>
            <GoogleLogin />
            <br />
            <FacebookLogin />
          </Grid>
          <Grid item xs={12}>
            <br />
            <TextDivider>Or</TextDivider>
            <TextField
              required
              data-cy="email-input"
              label="Enter email"
              autoComplete="username"
              className="login"
              margin="normal"
              value={login}
              onChange={(e) => {
                setLogin(e.target.value)
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              data-cy="password-input"
              type="password"
              autoComplete="current-password"
              label="Enter password"
              className="password"
              margin="normal"
              value={password}
              onKeyDown={handleEnterKey}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              fullWidth
              helperText={forgotPasswordLink}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              data-cy="login-btn"
              color="primary"
              className="login-btn"
              disabled={doingLogin}
              onClick={onLogin}
              fullWidth
            >
              Sign in
            </Button>
          </Grid>
          <Grid item xs={12}>
            <br />
            No account yet?{' '}
            <Link component={RouterLink} to="/signup" id="sign-up-link">
              Sign up here
            </Link>
          </Grid>
        </Grid>
      </form>
    </StyledLoginForm>
  )
}

LoginForm.propTypes = {
  doingLogin: PropTypes.bool.isRequired,
  setDoingLogin: PropTypes.func.isRequired,
  onAfterLogin: PropTypes.func.isRequired,
}

LoginForm.defaultProps = {}

export default LoginForm
