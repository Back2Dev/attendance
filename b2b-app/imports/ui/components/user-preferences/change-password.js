import { Meteor } from 'meteor/meteor'
import React, { useContext, useState, useEffect } from 'react'
import { AutoForm, AutoField, ErrorsField, SubmitField } from 'uniforms-material'
import {
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
} from '@material-ui/core/'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'
import PasswordBridge from '/imports/ui/utils/password-validation/password-bridge.js'
import PasswordValidator from '/imports/ui/utils/password-validation/password-validator.js'
import GoogleButton from 'react-google-button'
import { FacebookButton } from '/imports/ui/components/facebook-login/facebook-login.js'

const passwordSchema = {
  password: { type: String, label: 'New password' },
  confirmPassword: {
    type: String,
    label: 'Confirm password',
  },
}

const bridge = new PasswordBridge(passwordSchema, PasswordValidator)

export default function UserPreferences() {
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const [userServices, setUserServices] = useState([])
  const { user } = useContext(AccountContext)

  useEffect(() => {
    Meteor.call('userServices', (err, res) => {
      if (err) {
        showError(err)
      } else {
        setUserServices(res)
        if (!res.includes('password')) {
          setShowPassword(false)
        }
      }
    })
  }, [])

  const changePassword = (form) => {
    form.id = user._id
    Meteor.call('setOwnPassword', { ...form, oldPassword: password }, false, function (
      err
    ) {
      if (err) {
        showError(err.message)
      } else {
        showSuccess('Changed password')
        setShowPassword(true)
      }
    })
  }

  const verifyPassword = () => {
    Meteor.call('verifyPassword', password, function (err) {
      if (err) {
        showError(err.message)
      } else {
        showSuccess('Password matched')
        setShowPassword(false)
      }
    })
  }

  const renderOldPassword = () => {
    if (!showPassword) {
      return null
    }
    return (
      <>
        <Typography variant="h5">Change your password</Typography>
        <br />
        Please enter your old password
        <TextField
          required
          id="old-password"
          autoComplete="password"
          className="password"
          type={passwordVisible ? 'text' : 'password'}
          label="Old password"
          onChange={(e) => {
            setPassword(e.target.value)
          }}
          onKeyDown={(e) => e.key == 'Enter' && verifyPassword()}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setPasswordVisible(!passwordVisible)
                  }}
                >
                  {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <br />
        <br />
        <Button
          variant="contained"
          data-cy="old-password-submit"
          color="primary"
          onClick={verifyPassword}
          fullWidth
        >
          Submit
        </Button>
      </>
    )
  }

  const renderNewPassword = () => {
    if (showPassword) {
      return null
    }
    return (
      <AutoForm schema={bridge} onSubmit={(e) => changePassword(e)}>
        <Typography variant="h5">Change your password</Typography>
        <AutoField name="password" id="new-password" type="password" fullWidth />
        <AutoField name="confirmPassword" id="confirm" type="password" fullWidth />
        <ErrorsField />
        <br />
        <br />
        <SubmitField id="next-button" color="primary" variant="contained" fullWidth>
          Submit
        </SubmitField>
      </AutoForm>
    )
  }

  return (
    <>
      {renderOldPassword()}
      {renderNewPassword()}
      <br />
      <br />
      <Typography variant="h5">Link account with:</Typography>
      <br />
      <Container>
        <>
          <GoogleButton
            onClick={() => {
              Meteor.linkWithGoogle({}, function (err) {
                if (err) {
                  if (err.message) showError(err.message)
                  else showError('Could not link account')
                } else {
                  showSuccess('Successfully linked account')
                  setUserServices('')
                }
              })
            }}
            label={userServices.includes('google') ? 'Linked' : 'Google'}
            style={{ width: '100%' }}
            disabled={userServices.includes('google') || !userServices.length}
          />
          <br />
          <br />
        </>
        <FacebookButton
          onClick={() => {
            Meteor.linkWithFacebook({}, function (err) {
              if (err) {
                showError(err.message)
              } else {
                showSuccess('Successfully linked account')
                setUserServices('')
              }
            })
          }}
          disabledProp={userServices.includes('facebook') || !userServices.length}
          fullWidth
        >
          {userServices.includes('facebook') ? 'Linked' : 'Facebook'}
        </FacebookButton>
      </Container>
    </>
  )
}
