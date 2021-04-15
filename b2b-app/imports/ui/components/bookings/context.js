import { Meteor } from 'meteor/meteor'
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Events from '/imports/api/events/schema.js'
import Members from '/imports/api/members/schema.js'
import Sessions from '../../../api/sessions/schema'

export const BookingsContext = React.createContext('bookings')

export const BookingsProvider = (props) => {
  const { children } = props

  const { member } = useContext(AccountContext)

  const getCoachByCoachId = (coachId) => {
    return Members.findOne({ _id: coachId })
  }

  const getMySessionByEventId = (eventId) => {
    return Sessions.findOne({
      memberId: member?._id,
      eventId,
    })
  }

  const { loading, events } = useTracker(() => {
    if (Meteor.isServer) {
      return { loading: false, events: null }
    }
    const sub = Meteor.subscribe('future.events')
    const events = Events.find({ active: true, when: { $gt: new Date() } })
    const eventsWithExtraData = events.map((event) => {
      return {
        ...event,
        coach: getCoachByCoachId(event.coachId),
        mySession: getMySessionByEventId(event._id),
      }
    })

    return {
      loading: !sub.ready(),
      events: eventsWithExtraData,
    }
  }, [])

  return (
    <BookingsContext.Provider
      value={{ loading, events, getCoachByCoachId, getMySessionByEventId }}
    >
      {children}
    </BookingsContext.Provider>
  )
}

BookingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const BookingsConsumer = BookingsContext.Consumer
