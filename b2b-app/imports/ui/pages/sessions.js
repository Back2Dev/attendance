import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import { Container } from '@material-ui/core'

import SessionDetails from '/imports/ui/components/session-details.js'

const StyledSessionsPage = styled.div``

function SessionsPage() {
  return (
    <StyledSessionsPage>
      <Helmet>
        <title>Sessions</title>
      </Helmet>
      <Container maxWidth="lg">
        <Switch>
          <Route exact path="/sessions/:id" component={SessionDetails} />
        </Switch>
      </Container>
    </StyledSessionsPage>
  )
}

export default SessionsPage
