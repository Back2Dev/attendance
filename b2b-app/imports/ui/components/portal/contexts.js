import { Meteor } from 'meteor/meteor'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import Events from '/imports/api/events/schema.js'
import Members from '/imports/api/members/schema.js'
import Sessions from '/imports/api/sessions/schema.js'
import Courses from '/imports/api/courses/schema.js'

export const MySessionsContext = React.createContext('my-sessions')

export const MySessionsProvider = (props) => {
  const { children } = props

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const [eventIds, setEventIds] = useState([])
  const [ccIds, setCcIds] = useState({ coachIds: [], courseIds: [] })

  const [recentSessionsWData, setRecentSessionsWData] = useState([])
  const [upcomingSessionsWData, setUpcomingSessionsWData] = useState([])

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

  const { loadingRecentSessions, recentSessions } = useTracker(() => {
    const sub = Meteor.subscribe('sessions.myRecent', {})
    return {
      loadingRecentSessions: !sub.ready(),
      recentSessions: Sessions.find(
        { bookedDate: { $lt: new Date() } },
        { sort: { bookedDate: -1 } }
      ).fetch(),
    }
  }, [])

  const { loadingUpcomingSessions, upcomingSessions } = useTracker(() => {
    const sub = Meteor.subscribe('sessions.myUpcoming')
    return {
      loadingUpcomingSessions: !sub.ready(),
      upcomingSessions: Sessions.find(
        { bookedDate: { $gt: new Date() } },
        { sort: { bookedDate: 1 } }
      ).fetch(),
    }
  }, [])

  const setEventIdsTimeout = useRef(null)
  useEffect(() => {
    Meteor.clearTimeout(setEventIdsTimeout.current)
    setEventIdsTimeout.current = Meteor.setTimeout(() => {
      const newEventIds = []
      recentSessions?.map((item) => {
        if (!newEventIds.includes(item.eventId)) {
          newEventIds.push(item.eventId)
        }
      })
      upcomingSessions?.map((item) => {
        if (!newEventIds.includes(item.eventId)) {
          newEventIds.push(item.eventId)
        }
      })
      setEventIds(newEventIds)
    }, 100)
  }, [recentSessions, upcomingSessions])

  const { loadingEvents = false, events = [] } = useTracker(() => {
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

  const buildSessionsData = useCallback(() => {
    setRecentSessionsWData(
      recentSessions?.map((item) => {
        const event = getEventById(item.eventId)
        return {
          ...item,
          event,
        }
      })
    )
    setUpcomingSessionsWData(
      upcomingSessions?.map((item) => {
        const event = getEventById(item.eventId)
        return {
          ...item,
          event,
        }
      })
    )
  }, [recentSessions, upcomingSessions])

  const buildTimeout = useRef(null)
  useEffect(() => {
    Meteor.clearTimeout(buildTimeout.current)
    if (!events.length) {
      return
    }
    buildTimeout.current = Meteor.setTimeout(buildSessionsData, 100)
  }, [recentSessions, upcomingSessions, events, loadingCC])

  return (
    <MySessionsContext.Provider
      value={{
        loadingEvents,
        loadingCC,
        loadingRecentSessions,
        loadingUpcomingSessions,
        recentSessionsWData,
        upcomingSessionsWData,
        getEventById,
        getCoachByCoachId,
        getCourseByCourseId,
      }}
    >
      {children}
    </MySessionsContext.Provider>
  )
}

MySessionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const MySessionsConsumer = MySessionsContext.Consumer
