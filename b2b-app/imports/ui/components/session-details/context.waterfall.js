import { Meteor } from 'meteor/meteor'
import React, { useContext, useEffect, useState, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'

// import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

// import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Events from '/imports/api/events/schema.js'
import Members from '/imports/api/members/schema.js'
import Sessions from '/imports/api/sessions/schema.js'
import Courses from '/imports/api/courses/schema.js'

export const SessionDetailsContext = React.createContext('sessiondetails')

export const SessionDetailsProvider = (props) => {
  const { children } = props

  const { id } = useParams()

  // const { member } = useContext(AccountContext)

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  // first, get the session
  const { loading, session } = useTracker(() => {
    const sub = Meteor.subscribe('sessions.myById', id)
    return {
      loading: !sub.ready(),
      session: Sessions.findOne({ _id: id }),
    }
  }, [id])

  // then get the event
  const { loadingEvent, event } = useTracker(() => {
    if (!session?.eventId) {
      return { loadingEvent: false, event: null }
    }
    const sub = Meteor.subscribe('events.byId', session.eventId)
    return {
      loadingEvent: !sub.ready(),
      event: Events.findOne({ _id: session.eventId, active: true }),
    }
  }, [session?.eventId])

  // load course
  const { loadingCourse, course } = useTracker(() => {
    if (!event?.courseId) {
      return { loadingCourse: false, course: null }
    }
    const sub = Meteor.subscribe('courses.byId', event.courseId)
    return {
      loadingCourse: !sub.ready(),
      course: Courses.findOne({ _id: event.courseId, active: true }),
    }
  }, [event?.courseId])

  // load other other sessions related to the event
  const { loadingOtherSessions, otherSessions } = useTracker(() => {
    if (!session?.eventId) {
      return { loadingOtherSessions: false, otherSessions: null }
    }
    const sub = Meteor.subscribe('sessions.byEventId', session.eventId)
    return {
      loadingOtherSessions: !sub.ready(),
      otherSessions: Sessions.find({
        _id: { $ne: session._id },
        eventId: session.eventId,
        status: { $ne: 'cancelled' },
      }).fetch(),
    }
  }, [session?.eventId])

  // then load all members who booked them
  const memberIds = useMemo(() => {
    const ids = []
    otherSessions?.map((item) => {
      if (!ids.includes(item.memberId)) {
        ids.push(item.memberId)
      }
    })
    if (event?.coachId && !ids.includes(event.coachId)) {
      ids.push(event.coachId)
    }
    return ids
  }, [otherSessions, event?.coachId])
  const { loadingMembers, members } = useTracker(() => {
    if (!memberIds.length) {
      return { loadingMembers: false, members: [] }
    }
    const sub = Meteor.subscribe('members.byIds', memberIds)
    return {
      loadingMembers: !sub.ready(),
      members: Members.find({
        _id: { $in: memberIds },
      }).fetch(),
    }
  }, [memberIds.length ? memberIds : null])

  return (
    <SessionDetailsContext.Provider
      value={{
        loading,
        session,
        loadingEvent,
        event,
        loadingCourse,
        course,
        loadingOtherSessions,
        otherSessions,
        loadingMembers,
        members,
      }}
    >
      {children}
    </SessionDetailsContext.Provider>
  )
}

SessionDetailsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const SessionDetailsConsumer = SessionDetailsContext.Consumer
