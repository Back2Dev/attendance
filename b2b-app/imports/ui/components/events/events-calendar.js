import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

import { EventsContext } from './events-context.js'

const StyledCalendar = styled.div`
  .fc {
    font-size: 0.875rem;
  }
`

function EventsCalendar() {
  const { events, getEventType } = useContext(EventsContext)

  const calendarEvents = useMemo(
    () =>
      events.map((event) => {
        const eventType = getEventType(event.typeId)
        return {
          id: event._id,
          title: event.name,
          date: event.when,
          backgroundColor: eventType?.color || '#1976d2',
          borderColor: eventType?.color || '#1976d2',
          extendedProps: { event },
        }
      }),
    [events]
  )

  return (
    <StyledCalendar>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        firstDay={1}
        height="auto"
      />
    </StyledCalendar>
  )
}

export default EventsCalendar
