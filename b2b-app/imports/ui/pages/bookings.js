import React from 'react'
import { Switch, Route } from 'react-router-dom'
import styled from 'styled-components'

import Bookings from '/imports/ui/components/bookings.js'

const StyledBookingsPage = styled.div``

function BookingsPage() {
  return (
    <StyledBookingsPage>
      <Switch>
        <Route component={Bookings} />
      </Switch>
    </StyledBookingsPage>
  )
}

export default BookingsPage
