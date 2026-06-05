import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { Container, Typography } from '@mui/material'

import { EventsProvider } from '/imports/ui/components/events/events-context.js'
import EventsList from '/imports/ui/components/events/events-list.js'

const StyledEventsPage = styled.div`
  padding: 24px 0;
`

function EventsPage() {
  return (
    <StyledEventsPage>
      <Helmet>
        <title>Events</title>
      </Helmet>
      <Container maxWidth="xl">
        <Typography variant="h4" component="h1" gutterBottom>
          Events
        </Typography>
        <EventsProvider>
          <EventsList />
        </EventsProvider>
      </Container>
    </StyledEventsPage>
  )
}

export default EventsPage
