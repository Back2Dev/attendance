import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'

import { Container } from '@mui/material'

import Bookings from '/imports/ui/components/bookings.js'
import BookingsHistory from '/imports/ui/components/bookings-history.js'

const StyledBookingsPage = styled.div``

function BookingsPage() {
  return (
    <StyledBookingsPage>
      <Helmet>
        <title>Bookings</title>
      </Helmet>
      <Container maxWidth="lg">
        <Routes>
          <Route path="history" element={<BookingsHistory />} />
          <Route path="*" element={<Bookings />} />
        </Routes>
      </Container>
    </StyledBookingsPage>
  )
}

export default BookingsPage
