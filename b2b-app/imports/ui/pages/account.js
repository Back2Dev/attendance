import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'

import { Grid } from '@material-ui/core'

// import Register from '/imports/ui/components/account/register.js';
// import Confirm from '/imports/ui/components/account/confirm.js';
// import SignupPasswords from '/imports/ui/pages/signup/signup-password.js'
import ForgotPassword from '/imports/ui/pages/forgot-password/forgot-password.js'
// import ResetPasswordForm from '/imports/ui/components/account/reset-password.js'
import AddGoogleConfirm from '/imports/ui/components/google-login/add-google-confirm.js'
import AddFacebookConfirm from '/imports/ui/components/facebook-login/add-facebook-confirm.js'
import NotFoundComponent from '/imports/ui/components/commons/not-found.js'
import SecureRoute from '/imports/ui/utils/secure-route.js'

const StyledAccountPage = styled.div``

function AccountPage() {
  useEffect(() => {
    // scroll to the top
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  return (
    <StyledAccountPage className="account-container">
      <Grid container>
        <Grid item xs={12}>
          <Switch>
            <Route component={NotFoundComponent} />
          </Switch>
        </Grid>
      </Grid>
    </StyledAccountPage>
  )
}

export default AccountPage
