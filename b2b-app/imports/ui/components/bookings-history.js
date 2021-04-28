import React from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'

import { BookingsHistoryProvider } from '/imports/ui/components/bookings-history/context.js'
import SessionsListing from '/imports/ui/components/bookings-history/sessions.js'

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
          <SessionsListing />
        </Typography>
      </BookingsHistoryProvider>
    </StyledBookings>
  )
}

export default BookingsHistory
