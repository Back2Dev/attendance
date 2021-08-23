import { Meteor } from 'meteor/meteor'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import Events from '/imports/api/events/schema.js'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

export const CalendarContext = React.createContext('carlendar')

export const CalendarProvider = (props) => {
  const { children } = props

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const [formOpen, setFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  })

  const timeZoneOffset = useMemo(() => {
    const date = new Date()
    console.log('timezone offset', date.getTimezoneOffset())
    return date.getTimezoneOffset()
  }, [])

  const { loadingEvents, events = [] } = useTracker(() => {
    const sub = Meteor.subscribe('events.byDateRange', {
      start: dateRange.start,
      end: dateRange.end,
    })
    return {
      loadingEvents: !sub.ready(),
      events: Events.find({}, { sort: { when: -1 } }).fetch(),
    }
  }, [dateRange])

  const selectEvent = (eventId) => {
    if (!eventId) {
      setSelectedEvent(null)
    }
    setSelectedEvent(Events.findOne({ _id: eventId }))
  }

  const storeEvent = ({ data, cb, recurring = '' }) => {
    setLoading(true)
    Meteor.call(
      data?._id ? 'update.events' : 'insert.events',
      { form: data, recurring },
      (error, result) => {
        if (!mounted.current) {
          return
        }
        setLoading(false)
        if (error) {
          showError(error.message)
        }
        if (result?.status === 'false') {
          showError(result?.message)
        }
        if (result?.status === 'success') {
          showSuccess(data?._id ? 'Event updated' : 'Event created')
        }
        if (typeof cb === 'function') {
          cb(result)
        }
      }
    )
  }

  const deleteEvent = ({ id, cb, recurring = '' }) => {
    setLoading(true)
    Meteor.call('rm.events', { id, recurring }, (error, result) => {
      if (!mounted.current) {
        return
      }
      setLoading(false)
      if (error) {
        showError(error.message)
      }
      if (result?.status === 'false') {
        showError(result?.message)
      }
      if (result?.status === 'success') {
        showSuccess('Event deleted')
      }
      if (typeof cb === 'function') {
        cb(result)
      }
    })
  }

  return (
    <CalendarContext.Provider
      value={{
        loading,
        setDateRange,
        loadingEvents,
        events,
        timeZoneOffset,
        formOpen,
        setFormOpen,
        selectedDate,
        setSelectedDate,
        selectedEvent,
        selectEvent,
        storeEvent,
        deleteEvent,
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
