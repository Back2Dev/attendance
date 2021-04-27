import { Meteor } from 'meteor/meteor'
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Events from '/imports/api/events/schema.js'
import Members from '/imports/api/members/schema.js'
import Sessions from '/imports/api/sessions/schema.js'
import Courses from '/imports/api/courses/schema.js'

export const BookingsHistoryContext = React.createContext('bookingshistory')

export const BookingsHistoryProvider = (props) => {
  const { children } = props

  const { member } = useContext(AccountContext)
  const [sessionsWData, setSessionsWData] = useState([])

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const [eventIds, setEventIds] = useState([])
  const [ccIds, setCcIds] = useState({ coachIds: [], courseIds: [] })

  const getCoachByCoachId = (coachId) => {
    return Members.findOne({ _id: coachId })
  }

  const getCourseByCourseId = (courseId) => {
    return Courses.findOne({ _id: courseId })
  }

  const getEventById = (eventId) => {
    const event = Events.findOne({ _id: eventId })
    if (event) {
      event.coach = getCoachByCoachId(event.coachId)
      event.course = getCourseByCourseId(event.courseId)
      event.backupCourse = getCourseByCourseId(event.backupCourseId)
    }
    return event
  }

  const { loadingSessions, sessions } = useTracker(() => {
    const sub = Meteor.subscribe('sessions.myAll', {})
    return {
      loadingSessions: !sub.ready(),
      sessions: Sessions.find(
        { memberId: member._id },
        { sort: { bookedDate: -1 } }
      ).fetch(),
    }
  }, [])

  const updateEventIdsTimeout = useRef(null)
  useEffect(() => {
    Meteor.clearTimeout(updateEventIdsTimeout.current)
    updateEventIdsTimeout.current = Meteor.setTimeout(() => {
      const newEventIds = []
      sessions?.map((item) => {
        if (!newEventIds.includes(item.eventId)) {
          newEventIds.push(item.eventId)
        }
      })
      if (newEventIds.length) {
        setEventIds(newEventIds)
      }
    }, 100)
  }, [sessions])

  const { loadingEvents = false, events = [] } = useTracker(() => {
    // console.log(eventIds)
    if (!eventIds.length) {
      return { loadingEvents: false }
    }
    const sub = Meteor.subscribe('events.byIds', eventIds)
    return {
      loadingEvents: !sub.ready(),
      events: Events.find({}).fetch(),
    }
  }, [eventIds])

  const coachAndCourseIdsTimeout = useRef(null)
  useEffect(() => {
    Meteor.clearTimeout(coachAndCourseIdsTimeout.current)
    coachAndCourseIdsTimeout.current = Meteor.setTimeout(() => {
      const newCoachIds = []
      const newCourseIds = []
      events.map((item) => {
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
      setCcIds({ coachIds: newCoachIds, courseIds: newCourseIds })
    }, 100)
  }, [events])

  const loadingCC = useTracker(() => {
    const coachSub = Meteor.subscribe('members.byIds', ccIds.coachIds)
    const courseSub = Meteor.subscribe('courses.byIds', ccIds.courseIds)
    return coachSub.ready() && courseSub.ready()
  }, [ccIds])

  const buildTimeout = useRef(null)
  useEffect(() => {
    Meteor.clearTimeout(buildTimeout.current)
    if (!events.length) {
      return
    }
    buildTimeout.current = Meteor.setTimeout(() => {
      const newData = sessions?.map((item) => {
        const event = getEventById(item.eventId)
        return {
          ...item,
          event,
        }
      })
      setSessionsWData(newData)
    }, 100)
  }, [sessions, events, loadingCC])

  return (
    <BookingsHistoryContext.Provider
      value={{
        loadingSessions,
        loadingEvents,
        sessionsWData,
      }}
    >
      {children}
    </BookingsHistoryContext.Provider>
  )
}

BookingsHistoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const BookingsHistoryConsumer = BookingsHistoryContext.Consumer
