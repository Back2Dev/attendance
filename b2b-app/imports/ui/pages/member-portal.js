import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import { Container } from '@material-ui/core'

import MemberPortal from '/imports/ui/components/portal.js'

const StyledMemberPortalPage = styled.div``

function MemberPortalPage() {
  return (
    <StyledMemberPortalPage>
      <Helmet>
        <title>Member Portal</title>
      </Helmet>
      <Container maxWidth="lg">
        <Switch>
          <Route component={MemberPortal} />
        </Switch>
      </Container>
    </StyledMemberPortalPage>
  )
}

export default MemberPortalPage
