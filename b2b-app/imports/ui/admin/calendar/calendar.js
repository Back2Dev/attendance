import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick

import { CalendarContext } from './contexts'

const StyledCalendar = styled.div``

function Calendar() {
  const { events } = useContext(CalendarContext)

  const handleDateClick = (props) => {
    console.log(props)
  }

  const handleEventClick = ({ event }) => {
    console.log(event.id)
  }

  const eventsData = useMemo(() => {
    return events.map((item) => ({
      id: item._id,
      title: item.name,
      date: item.when,
    }))
  }, [events])

  return (
    <StyledCalendar>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        events={eventsData}
        eventClick={handleEventClick}
      />
    </StyledCalendar>
  )
}

export default Calendar
