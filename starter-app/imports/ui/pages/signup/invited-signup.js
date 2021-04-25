import React, { useContext, useState, useEffect, useReducer } from 'react'
import { useHistory } from 'react-router-dom'
import { AutoForm, AutoField, ErrorsField, SubmitField } from 'uniforms-material'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { Grid, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'
import { showError } from '/imports/ui/utils/toast-alerts'
import MaterialPhoneNumber from '/imports/ui/components/mui-phone-number.js'

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
      const { userId, email, name, mobile, nickname } = payload
      return {
        ...state,
        userId,
        invitedEmail: email,
        invitedName: name,
        invitedMobile: mobile,
        invitedNickname: nickname,
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
    invitedNickname: '',
  })
  const { userId, invitedEmail, invitedName, invitedMobile, invitedNickname } = state

  console.log(invitedNickname)

  useEffect(() => {
    Meteor.call('getUserFromToken', token, (error, result) => {
      if (error) {
        showError(error.message)
        dispatch({ type: 'setLoading', payload: false })
      }
      if (result) {
        const { status, message, userId, email, name, mobile, nickname } = result
        console.log(result)
        if (status === 'failed') {
          return showError(message)
        }
        return dispatch({
          type: 'setData',
          payload: { userId, email, name, mobile, nickname },
        })
      }
    })
  }, [])

  const signup = (form) => {
    form.invitedEmail = invitedEmail
    form.invitedName = invitedName
    Object.keys(form).map(
      (key) => (form[key] = typeof form[key] == 'string' ? form[key].trim() : form[key])
    )
    setSubmitEnabled(false)
    Meteor.call('invitedSignup', form, userId, token, (err) => {
      if (err) {
        showError(err)
        setSubmitEnabled(true)
      } else {
        push('/confirmation-sent', { name: form.name })
      }
    })
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
            <Typography variant="h1">{`Welcome ${invitedNickname || 'User'}`}</Typography>
            <Typography>Please confirm your details and click submit</Typography>
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
              href="https://settleeasy.com.au/terms-of-use/"
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
          Welcome
        </Typography>
        <p>
          You are logged in. <br />
          Please take a minute to complete your profile <a href="/profile">here</a>.
        </p>
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
