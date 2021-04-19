import React from 'react'
import { Switch, Route } from 'react-router-dom'
import styled from 'styled-components'

import { Container } from '@material-ui/core'

import Bookings from '/imports/ui/components/bookings.js'

const StyledBookingsPage = styled.div``

function BookingsPage() {
  return (
    <StyledBookingsPage>
      <Container maxWidth="lg">
        <Switch>
          <Route component={Bookings} />
        </Switch>
      </Container>
    </StyledBookingsPage>
  )
}

export default BookingsPage
