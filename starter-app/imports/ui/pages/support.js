import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'

import { Grid } from '@material-ui/core'

import NotFoundComponent from '/imports/ui/components/commons/not-found.js'
import SecureRoute from '/imports/ui/utils/secure-route.js'

import SupportForm from '/imports/ui/components/support/form.js'

const StyledSupportPage = styled.div``

function SupportPage() {
  useEffect(() => {
    // scroll to the top
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  return (
    <StyledSupportPage className="account-container">
      <Grid container>
        <Grid item xs={12}>
          <Switch>
            <SecureRoute path="/support" exact component={SupportForm} />
            <Route component={NotFoundComponent} />
          </Switch>
        </Grid>
      </Grid>
    </StyledSupportPage>
  )
}

export default SupportPage
