import React from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'

import { BookingsProvider } from '/imports/ui/components/bookings/context.js'

const StyledBookings = styled.div``

function Bookings() {
  return (
    <StyledBookings>
      <BookingsProvider>
        <Typography variant="h1">Bookings</Typography>
      </BookingsProvider>
    </StyledBookings>
  )
}

export default Bookings
