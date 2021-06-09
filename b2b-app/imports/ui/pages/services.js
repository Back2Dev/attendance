import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import { Container } from '@material-ui/core'

import ServicingHome from '/imports/ui/components/services/home'
import CreateService from '/imports/ui/components/services/create'
import SecureRoute from '/imports/ui/utils/secure-route.js'

const StyledServicesPage = styled.div``

function ServicesPage() {
  return (
    <StyledServicesPage>
      <Helmet>
        <title>Services</title>
      </Helmet>
      <Container maxWidth="lg">
        <Switch>
          <SecureRoute
            roles={['ADM', 'GRE']}
            path="/services/new"
            component={CreateService}
          />
          <SecureRoute roles={['ADM', 'GRE']} component={ServicingHome} />
        </Switch>
      </Container>
    </StyledServicesPage>
  )
}

export default ServicesPage
