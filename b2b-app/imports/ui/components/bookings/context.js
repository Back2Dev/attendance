import { Meteor } from 'meteor/meteor'
import React, { useContext, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Events from '/imports/api/events/schema.js'
import Bookings from '/imports/api/bookings/schema.js'

export const BookingsContext = React.createContext('bookings')

export const BookingsProvider = (props) => {
  const { children } = props

  const { member } = useContext(AccountContext)

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  // const [ids, setIds] = useState({ eventIds: [], coachIds: [], courseIds: [] })

  const getMySessionByEventId = (eventId) => {
    return Bookings.findOne({
      profileId: member?._id,
      eventId,
    })
  }

  const { loading, events } = useTracker(() => {
    console.log('subscribe future.events')
    const sub = Meteor.subscribe('future.events')
    return {
      loading: !sub.ready(),
      events: Events.find(
        {
          // status: 'active',
          when: { $gt: new Date() },
        },
        { sort: { when: 1 } }
      ).fetch(),
    }
  }, [])

  const [submiting, setSubmiting] = useState(false)
  // book action
  const book = async ({ eventId, toolId }) => {
    setSubmiting(true)
    try {
      const result = await Meteor.callAsync('book.events', { eventId, toolId })
      if (!mounted.current) {
        return
      }
      setSubmiting(false)
      if (result?.status === 'success') {
        showSuccess('Event booked successfully')
      } else {
        showError(result?.message || 'Unknown error')
      }
    } catch (error) {
      if (mounted.current) {
        setSubmiting(false)
        showError(error.message)
      }
    }
  }
  // cancel action
  const cancel = async ({ bookingId }) => {
    setSubmiting(true)
    try {
      const result = await Meteor.callAsync('cancel.events', { bookingId })
      if (!mounted.current) {
        return
      }
      setSubmiting(false)
      if (result?.status === 'success') {
        showSuccess('Event booking cancelled successfully')
      } else {
        showError(result?.message || 'Unknown error')
      }
    } catch (error) {
      if (mounted.current) {
        setSubmiting(false)
        showError(error.message)
      }
    }
  }

  return (
    <BookingsContext.Provider
      value={{
        loading,
        events,
        getMySessionByEventId,
        book,
        cancel,
        submiting,
      }}
    >
      {children}
    </BookingsContext.Provider>
  )
}

BookingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const BookingsConsumer = BookingsContext.Consumer
