import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import { Container } from '@mui/material'

import SessionDetails from '/imports/ui/components/session-details'

const StyledBookingsSchedulePage = styled.div``

function BookingsSchedulePage() {
  return (
    <StyledBookingsSchedulePage>
      <Helmet>
        <title>Bookings</title>
      </Helmet>
      <Container maxWidth="lg">
        <Routes>
          <Route path=":id" element={<SessionDetails />} />
        </Routes>
      </Container>
    </StyledBookingsSchedulePage>
  )
}

export default BookingsSchedulePage
