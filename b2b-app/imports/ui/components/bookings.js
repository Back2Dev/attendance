import React from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'

import { BookingsProvider } from '/imports/ui/components/bookings/context.js'
import ListEvents from './bookings/events.js'

const StyledBookings = styled.div``

function Bookings() {
  return (
    <StyledBookings>
      <BookingsProvider>
        <Typography variant="h1">Bookings</Typography>
        <ListEvents />
      </BookingsProvider>
    </StyledBookings>
  )
}

export default Bookings
