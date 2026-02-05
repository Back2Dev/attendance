import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import { Container } from '@mui/material'

import ServicingHome from '/imports/ui/components/services/home'
import CreateService from '/imports/ui/components/services/create'
import JobDetails from '/imports/ui/components/services/details'
import SecureRoute from '/imports/ui/utils/secure-route.js'

const StyledServicesPage = styled.div``

function ServicesPage() {
  return (
    <StyledServicesPage>
      <Helmet>
        <title>Services</title>
      </Helmet>
      <Container maxWidth="lg">
        <Routes>
          <Route
            path="new"
            element={
              <SecureRoute roles={['ADM', 'GRE']}>
                <CreateService />
              </SecureRoute>
            }
          />
          <Route
            path=":id/edit"
            element={
              <SecureRoute roles={['ADM', 'GRE']}>
                <CreateService />
              </SecureRoute>
            }
          />
          <Route
            path=":id"
            element={
              <SecureRoute roles={['ADM', 'GRE']}>
                <JobDetails />
              </SecureRoute>
            }
          />
          <Route
            path="*"
            element={
              <SecureRoute roles={['ADM', 'GRE']}>
                <ServicingHome />
              </SecureRoute>
            }
          />
        </Routes>
      </Container>
    </StyledServicesPage>
  )
}

export default ServicesPage
