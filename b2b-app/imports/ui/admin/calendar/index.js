import React from 'react'
import styled from 'styled-components'

import { CalendarProvider } from './contexts'
import Calendar from './calendar'

const StyledEventCalendar = styled.div`
  padding: 40px 10px;
`

function EventCalendar() {
  return (
    <StyledEventCalendar>
      <CalendarProvider>
        <Calendar />
      </CalendarProvider>
    </StyledEventCalendar>
  )
}

export default EventCalendar
