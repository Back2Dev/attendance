import { Meteor } from 'meteor/meteor'
import React, { useContext, useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Events from '/imports/api/events/schema.js'
import Bookings from '/imports/api/bookings/schema.js'
import EventTypes from '/imports/api/event-types/schema.js'

export const EventsContext = React.createContext('events')

export const EventsProvider = ({ children }) => {
  const { member } = useContext(AccountContext)
  const [showPast, setShowPast] = useState(false)
  const [viewMode, setViewMode] = useState('cards') // 'cards' | 'compact' | 'calendar'
  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const isLoggedIn = !!member

  const { loading, events, bookings, eventTypes } = useTracker(() => {
    const pubName = isLoggedIn ? 'events.member' : 'events.public'
    const sub = Meteor.subscribe(pubName, { showPast })
    const typesSub = Meteor.subscribe('all.event-types')

    const now = new Date()
    const dateFilter = showPast ? { $lt: now } : { $gte: now }
    const sortDir = showPast ? -1 : 1

    return {
      loading: !sub.ready() || !typesSub.ready(),
      events: Events.find(
        { status: { $in: ['active', 'cancelled'] }, when: dateFilter },
        { sort: { when: sortDir } }
      ).fetch(),
      bookings: Bookings.find({ profileId: member?._id }).fetch(),
      eventTypes: EventTypes.find({}).fetch(),
    }
  }, [isLoggedIn, member?._id, showPast])

  const getBookingForEvent = (eventId) =>
    bookings.find((b) => b.eventId === eventId && b.status !== 'cancelled')

  const getEventType = (typeId) => eventTypes.find((t) => t._id === typeId)

  const [submitting, setSubmitting] = useState(false)

  const book = async (eventId) => {
    setSubmitting(true)
    try {
      const result = await Meteor.callAsync('book.events', { eventId })
      if (!mounted.current) return
      setSubmitting(false)
      if (result?.status === 'success') {
        showSuccess('Booked successfully')
      } else {
        showError(result?.message || 'Unknown error')
      }
    } catch (err) {
      if (mounted.current) {
        setSubmitting(false)
        showError(err.message)
      }
    }
  }

  const cancel = async (bookingId) => {
    setSubmitting(true)
    try {
      const result = await Meteor.callAsync('cancel.events', { bookingId })
      if (!mounted.current) return
      setSubmitting(false)
      if (result?.status === 'success') {
        showSuccess('Booking cancelled')
      } else {
        showError(result?.message || 'Unknown error')
      }
    } catch (err) {
      if (mounted.current) {
        setSubmitting(false)
        showError(err.message)
      }
    }
  }

  return (
    <EventsContext.Provider
      value={{
        loading,
        events,
        eventTypes,
        showPast,
        setShowPast,
        viewMode,
        setViewMode,
        getBookingForEvent,
        getEventType,
        isLoggedIn,
        submitting,
        book,
        cancel,
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}

EventsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
