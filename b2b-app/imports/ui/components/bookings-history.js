import React from 'react'
import styled from 'styled-components'

import { Typography } from '@mui/material'

import { BookingsHistoryProvider } from '/imports/ui/components/bookings-history/context.js'
import BookingsListing from '/imports/ui/components/bookings-history/bookings.js'

const StyledBookings = styled.div`
  margin: 60px auto;
  h1 {
    margin: 20px 0;
  }
`

function BookingsHistory() {
  return (
    <StyledBookings>
      <BookingsHistoryProvider>
        <Typography variant="h1" align="center">
          Bookings History
        </Typography>
        <BookingsListing />
      </BookingsHistoryProvider>
    </StyledBookings>
  )
}

export default BookingsHistory
