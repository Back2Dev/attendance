import React, { useContext, useState, useEffect, useReducer } from 'react'
import { AutoForm, AutoField, ErrorsField, SubmitField } from 'uniforms-mui'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { Grid, Typography, Button } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import RegEx from '/imports/api/regexp'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'
import { showError } from '/imports/ui/utils/toast-alerts'
import MaterialPhoneNumber from '/imports/ui/components/mui-phone-number.js'
import useHistory from '/imports/ui/utils/history'

let userSchema = new SimpleSchema2Bridge({
  schema: new SimpleSchema({
    name: { type: String, max: 200 },
    email: {
      type: String,
      max: 200,
      regEx: RegEx.EmailWithTLD,
    },
    mobile: {
      type: String,
      min: 6,
      max: 50,
      regEx: RegEx.Phone,
      uniforms: {
        component: MaterialPhoneNumber,
      },
    },
  }),
})

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '50px',
    maxWidth: '450px',
  },
  link: {
    color: '#4794fc',
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

function infoReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setLoading': {
      return {
        ...state,
        loading: payload,
      }
    }
    case 'setData': {
      const { userId, email, name, mobile } = payload
      return {
        ...state,
        userId,
        invitedEmail: email,
        invitedName: name,
        invitedMobile: mobile,
      }
    }
    default:
      return state
  }
}

const InvitedSignup = (props) => {
  const [submitEnabled, setSubmitEnabled] = useState(true)
  const classes = useStyles()
  const { push } = useHistory()
  const { user } = useContext(AccountContext)
  const token = props.match.params.token

  const [state, dispatch] = useReducer(infoReducer, {
    userId: null,
    invitedEmail: '',
    invitedName: '',
    invitedMobile: '',
  })
  const { userId, invitedEmail, invitedName, invitedMobile } = state

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const result = await Meteor.callAsync('getUserFromToken', token)
        if (!isMounted || !result) return
        const { status, message, userId, email, name, mobile } = result
        if (status === 'failed') {
          showError(message)
          return
        }
        dispatch({ type: 'setData', payload: { userId, email, name, mobile } })
      } catch (error) {
        if (isMounted) {
          showError(error.message || error)
          dispatch({ type: 'setLoading', payload: false })
        }
      }
    })()
    return () => {
      isMounted = false
    }
  }, [token])

  const signup = async (form) => {
    form.invitedEmail = invitedEmail
    form.invitedName = invitedName
    Object.keys(form).map(
      (key) => (form[key] = typeof form[key] == 'string' ? form[key].trim() : form[key])
    )
    setSubmitEnabled(false)
    try {
      await Meteor.callAsync('invitedSignup', form, userId, token)
      push('/confirmation-sent', { name: form.name })
    } catch (err) {
      showError(err)
      setSubmitEnabled(true)
    }
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
          <AutoForm
            schema={userSchema}
            onSubmit={(e) => signup(e)}
            model={{ name: invitedName, email: invitedEmail, mobile: invitedMobile }}
          >
            <Typography variant="h1">Sign up</Typography>
            <AutoField name="name" fullWidth />
            <AutoField name="email" fullWidth />
            <br />
            <br />
            <AutoField name="mobile" defaultValue={invitedMobile} fullWidth />
            <ErrorsField />
            <br />
            <br />
            By clicking submit you are agreeing to the{' '}
            <a
              href="/terms-of-use/"
              className={classes.link}
              target="_blank"
              rel="noreferrer"
            >
              terms and conditions
            </a>
            .
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
          </AutoForm>
        </Grid>
      )
    }
    return (
      <div className="logout-form">
        <Typography variant="h1" color="inherit" noWrap>
          Account
        </Typography>
        <p>You are logged in</p>
        <div className="center-align">
          <Button
            variant="contained"
            color="primary"
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    )
  }

  return <OnboardingModal renderForm={renderForm} />
}

export default InvitedSignup
