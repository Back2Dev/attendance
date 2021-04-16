import { Meteor } from 'meteor/meteor'
import React, { useContext, useEffect, useState, useRef } from 'react'
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

  const eventIds = useRef([])
  const coachIds = useRef([])

  const [eventsWithExtraData, setEventsWithExtraData] = useState([])

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
    // console.log('subscribe future.events')
    const sub = Meteor.subscribe('future.events')
    return {
      loading: !sub.ready(),
      events: Events.find({ active: true, when: { $gt: new Date() } }).fetch(),
    }
  }, [])

  useEffect(() => {
    const newEventIds = []
    const newCoachIds = []
    events.map((item) => {
      newEventIds.push(item._id)
      newCoachIds.push(item.coachId)
    })
    eventIds.current = newEventIds
    coachIds.current = newCoachIds
  }, [events])

  const { loading: loadingCoaches } = useTracker(() => {
    if (!coachIds.current.length) {
      return { loading: false }
    }
    // console.log('subscribe members.byIds', coachIds.current)
    const sub = Meteor.subscribe('members.byIds', coachIds.current)
    return {
      loading: !sub.ready(),
    }
  }, [coachIds.current])

  const { loading: loadingSessions } = useTracker(() => {
    if (!eventIds.current.length) {
      return { loading: false }
    }
    const sub = Meteor.subscribe('sessions.mineByEventIds', eventIds.current)
    return {
      loading: !sub.ready(),
    }
  }, [eventIds.current])

  useEffect(() => {
    setEventsWithExtraData(
      events?.map((item) => {
        return {
          ...item,
          coach: getCoachByCoachId(item.coachId),
          session: getMySessionByEventId(item._id),
        }
      })
    )
  }, [events, loadingCoaches, loadingSessions])

  return (
    <BookingsContext.Provider
      value={{
        loading,
        loadingCoaches,
        loadingSessions,
        events: eventsWithExtraData,
        getCoachByCoachId,
        getMySessionByEventId,
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
