import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import Events from '/imports/api/events/schema.js'

export const CalendarContext = React.createContext('carlendar')

export const CalendarProvider = (props) => {
  const { children } = props

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const [formOpen, setFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  const { loadingEvents, events = [] } = useTracker(() => {
    const sub = Meteor.subscribe('all.events', {})
    return {
      loadingEvents: !sub.ready(),
      events: Events.find({}, { sort: { when: -1 } }).fetch(),
    }
  }, [])

  return (
    <CalendarContext.Provider
      value={{
        loadingEvents,
        events,
        formOpen,
        setFormOpen,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

CalendarProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const CalendarConsumer = CalendarContext.Consumer
