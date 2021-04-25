import React, { useState, useContext, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import QueryString from 'query-string'
import { useHistory } from 'react-router-dom'

import { Button, Typography } from '@material-ui/core'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import { showError } from '/imports/ui/utils/toast-alerts'
import LoginForm from './login/form.js'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'

function Login() {
  const { push, location } = useHistory()
  const searchObj = QueryString.parse(location.search)
  const redirect = location.pathname === '/login' ? '/dashboard' : location.pathname
  const redirectURL = searchObj && searchObj.redirect ? searchObj.redirect : redirect
  const loginMessage = searchObj ? searchObj.message : null
  const doLogout = searchObj ? searchObj.doLogout : false

  const { user, loading } = useContext(AccountContext)

  const [doingLogin, setDoingLogin] = useState(false)

  useEffect(() => {
    if (user) {
      if (!doLogout && searchObj && searchObj.redirect) {
        push(redirectURL)
      }
    }
  }, [user, searchObj, redirectURL, doLogout])

  const onAfterLogin = () => {
    push(redirectURL)
  }

  const onLogout = (e) => {
    e.preventDefault()
    Meteor.logout((error) => {
      if (error) {
        showError(error.message)
      } else {
        // send user to login page
        if (doLogout && redirectURL) {
          push(
            `/login?${QueryString.stringify({
              message: loginMessage,
              redirect: redirectURL,
            })}`
          )
          return
        }
        push('/logged-out')
      }
    })
  }

  const renderForm = () => {
    return (
      <div>
        <LoginForm
          doingLogin={doingLogin}
          setDoingLogin={setDoingLogin}
          onAfterLogin={onAfterLogin}
        />
      </div>
    )
  }

  // console.log(this.context);
  return (
    <div>
      {loginMessage ? <div className="login-message">{loginMessage}</div> : null}
      <OnboardingModal renderForm={renderForm} />
    </div>
  )
}

Login.propTypes = {}

Login.defaultProps = {}

export default Login
