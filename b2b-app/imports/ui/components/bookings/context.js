import { Meteor } from 'meteor/meteor'
import React, { useContext, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Events from '/imports/api/events/schema.js'
import Sessions from '/imports/api/sessions/schema.js'

export const BookingsContext = React.createContext('bookings')

export const BookingsProvider = (props) => {
  const { children } = props

  const { member } = useContext(AccountContext)

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  // const [ids, setIds] = useState({ eventIds: [], coachIds: [], courseIds: [] })

  const getMySessionByEventId = (eventId) => {
    return Sessions.findOne({
      memberId: member?._id,
      eventId,
    })
  }

  const { loading, events } = useTracker(() => {
    // console.log('subscribe future.events')
    const sub = Meteor.subscribe('future.events')
    return {
      loading: !sub.ready(),
      events: Events.find({ status: 'active', when: { $gt: new Date() } }).fetch(),
    }
  }, [])

  const [submiting, setSubmiting] = useState(false)
  // book action
  const book = ({ eventId, toolId }) => {
    setSubmiting(true)
    Meteor.call('book.events', { eventId, toolId }, (error, result) => {
      if (!mounted.current) {
        return
      }
      setSubmiting(false)
      if (error) {
        showError(error.message)
      }
      if (result) {
        if (result.status === 'success') {
          showSuccess('Event booked successfully')
        } else {
          showError(result.message || 'Unknown error')
        }
      }
    })
  }
  // cancel action
  const cancel = ({ sessionId }) => {
    setSubmiting(true)
    Meteor.call('cancel.events', { sessionId }, (error, result) => {
      if (!mounted.current) {
        return
      }
      setSubmiting(false)
      if (error) {
        showError(error.message)
      }
      if (result) {
        if (result.status === 'success') {
          showSuccess('Event booking cancelled successfully')
        } else {
          showError(result.message || 'Unknown error')
        }
      }
    })
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
