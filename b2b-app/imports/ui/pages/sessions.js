import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import { Container } from '@mui/material'

import SessionDetails from '/imports/ui/components/session-details.js'

const StyledSessionsPage = styled.div``

function SessionsPage() {
  return (
    <StyledSessionsPage>
      <Helmet>
        <title>Sessions</title>
      </Helmet>
      <Container maxWidth="lg">
        <Routes>
          <Route path=":id" element={<SessionDetails />} />
        </Routes>
      </Container>
    </StyledSessionsPage>
  )
}

export default SessionsPage
