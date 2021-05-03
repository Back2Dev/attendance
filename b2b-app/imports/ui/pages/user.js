import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import { Container } from '@material-ui/core'

import Portal from '/imports/ui/components/portal.js'
import UserPreferences from '/imports/ui/components/user-preferences/user-preferences.js'

const StyledUserPage = styled.div``

function UserPage() {
  return (
    <StyledUserPage>
      <Helmet>
        <title>Member</title>
      </Helmet>
      <Container maxWidth="lg">
        <Switch>
          <Route path="/profile" component={UserPreferences} />
          <Route component={Portal} />
        </Switch>
      </Container>
    </StyledUserPage>
  )
}

export default UserPage
