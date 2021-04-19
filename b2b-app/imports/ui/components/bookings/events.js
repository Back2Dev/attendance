import React, { useContext } from 'react'
import styled from 'styled-components'

import { BookingsContext } from './context.js'
import EventItem from './event-item.js'

const StyledListEvents = styled.div``

function ListEvents() {
  const { events } = useContext(BookingsContext)

  const renderItems = () => {
    if (!events.length) {
      return null
    }
    return events.map((item) => <EventItem key={item._id} event={item} />)
  }

  return <StyledListEvents>{renderItems()}</StyledListEvents>
}

export default ListEvents
