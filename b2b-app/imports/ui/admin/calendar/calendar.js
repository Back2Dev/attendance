import React, { useContext, useMemo } from 'react'
import styled from 'styled-components'

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick

import { CalendarContext } from './contexts'
import EventForm from './form'

const StyledCalendar = styled.div``

function Calendar() {
  const { events, setFormOpen, setSelectedDate, selectEvent, setDateRange } = useContext(
    CalendarContext
  )

  const handleDateClick = ({ date }) => {
    setFormOpen(true)
    setSelectedDate(date)
  }

  const handleEventClick = ({ event }) => {
    console.log(event.id)
    setFormOpen(true)
    selectEvent(event.id)
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
        firstDay={1} // start with monday
        datesSet={(dateInfo) => {
          setDateRange({ start: dateInfo.start, end: dateInfo.end })
        }}
      />
      <EventForm />
    </StyledCalendar>
  )
}

export default Calendar
