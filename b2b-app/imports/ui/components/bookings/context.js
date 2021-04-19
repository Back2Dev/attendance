import { Meteor } from 'meteor/meteor'
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Events from '/imports/api/events/schema.js'
import Members from '/imports/api/members/schema.js'
import Sessions from '/imports/api/sessions/schema.js'
import Courses from '/imports/api/courses/schema.js'

export const BookingsContext = React.createContext('bookings')

export const BookingsProvider = (props) => {
  const { children } = props

  const { member } = useContext(AccountContext)

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const eventIds = useRef([])
  const coachIds = useRef([])
  const courseIds = useRef([])

  const [eventsWithExtraData, setEventsWithExtraData] = useState([])

  const getCoachByCoachId = (coachId) => {
    return Members.findOne({ _id: coachId })
  }

  const getCourseByCourseId = (courseId) => {
    return Courses.findOne({ _id: courseId })
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
    const newCourseIds = []
    events.map((item) => {
      newEventIds.push(item._id)
      newCoachIds.push(item.coachId)
      newCourseIds.push(item.courseId)
      if (item.backupCourseId) {
        newCourseIds.push(item.backupCourseId)
      }
    })
    eventIds.current = newEventIds
    coachIds.current = newCoachIds
    courseIds.current = newCourseIds
  }, [events])

  const { loading: loadingCoaches, coaches } = useTracker(() => {
    if (!coachIds.current.length) {
      return { loading: false }
    }
    // console.log('subscribe members.byIds', coachIds.current)
    const sub = Meteor.subscribe('members.byIds', coachIds.current)
    return {
      loading: !sub.ready(),
      coaches: Members.find({ _id: { $in: coachIds.current } }).fetch(),
    }
  }, [coachIds.current])

  const { loading: loadingSessions, sessions } = useTracker(() => {
    if (!eventIds.current.length) {
      return { loading: false }
    }
    const sub = Meteor.subscribe('sessions.mineByEventIds', eventIds.current)
    return {
      loading: !sub.ready(),
      sessions: Sessions.find({ eventId: { $in: eventIds.current } }).fetch(),
    }
  }, [eventIds.current])

  const { loading: loadingCourses, courses } = useTracker(() => {
    const sub = Meteor.subscribe('courses.byIds', courseIds.current)
    return {
      loading: !sub.ready(),
      courses: Courses.find({ _id: { $in: courseIds.current } }).fetch(),
    }
  }, [courseIds.current])

  const buildEventsData = useCallback(() => {
    setEventsWithExtraData(
      events?.map((item) => {
        return {
          ...item,
          coach: getCoachByCoachId(item.coachId),
          session: getMySessionByEventId(item._id),
          course: getCourseByCourseId(item.courseId),
          backupCourse: getCourseByCourseId(item.backupCourseId),
        }
      })
    )
  }, [events])

  useEffect(() => {
    buildEventsData()
  }, [events, courses, sessions, coaches])

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
        loadingCoaches,
        loadingSessions,
        loadingCourses,
        events: eventsWithExtraData,
        getCoachByCoachId,
        getMySessionByEventId,
        getCourseByCourseId,
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