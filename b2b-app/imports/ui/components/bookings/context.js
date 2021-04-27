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

  const [ids, setIds] = useState({ eventIds: [], coachIds: [], courseIds: [] })

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

  const setIdsTimeout = useRef(null)
  useEffect(() => {
    Meteor.clearTimeout(setIdsTimeout.current)
    setIdsTimeout.current = Meteor.setTimeout(() => {
      const newEventIds = []
      const newCoachIds = []
      const newCourseIds = []
      events.map((item) => {
        if (!newEventIds.includes(item._id)) {
          newEventIds.push(item._id)
        }
        if (!newCoachIds.includes(item.coachId)) {
          newCoachIds.push(item.coachId)
        }
        if (!newCourseIds.includes(item.courseId)) {
          newCourseIds.push(item.courseId)
        }
        if (item.backupCourseId && !newCourseIds.includes(item.backupCourseId)) {
          newCourseIds.push(item.backupCourseId)
        }
      })
      setIds({
        eventIds: newEventIds,
        coachIds: newCoachIds,
        courseIds: newCourseIds,
      })
    }, 100)
  }, [events])

  const { loading: loadingCoaches, coaches } = useTracker(() => {
    if (!ids.coachIds.length) {
      return { loading: false }
    }
    // console.log('subscribe members.byIds', coachIds.current)
    const sub = Meteor.subscribe('members.byIds', ids.coachIds)
    return {
      loading: !sub.ready(),
      coaches: Members.find({ _id: { $in: ids.coachIds } }).fetch(),
    }
  }, [ids.coachIds])

  const { loading: loadingSessions, sessions } = useTracker(() => {
    if (!ids.eventIds.length) {
      return { loading: false }
    }
    const sub = Meteor.subscribe('sessions.mineByEventIds', ids.eventIds)
    return {
      loading: !sub.ready(),
      sessions: Sessions.find({ eventId: { $in: ids.eventIds } }).fetch(),
    }
  }, [ids.eventIds])

  const { loading: loadingCourses, courses } = useTracker(() => {
    const sub = Meteor.subscribe('courses.byIds', ids.courseIds)
    return {
      loading: !sub.ready(),
      courses: Courses.find({ _id: { $in: ids.courseIds } }).fetch(),
    }
  }, [ids.courseIds])

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

  const buildDataTimeout = useRef(null)
  useEffect(() => {
    Meteor.clearTimeout(buildDataTimeout.current)
    buildDataTimeout.current = Meteor.setTimeout(buildEventsData, 100)
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
