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

  const eventIds = useRef([])
  const coachIds = useRef([])
  const courseIds = useRef([])

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

  useEffect(() => {
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
    eventIds.current = newEventIds
  }, [recentSessions, upcomingSessions])

  const { loadingEvents = false, events = [] } = useTracker(() => {
    if (!eventIds.current.length) {
      return { loadingEvents: false }
    }
    const sub = Meteor.subscribe('events.byIds', eventIds.current)
    return {
      loadingEvents: !sub.ready(),
      events: Events.find({}).fetch(),
    }
  }, [eventIds.current])

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
      coachIds.current = newCoachIds
      courseIds.current = newCourseIds
    }, 100)
  }, [events])

  const { loading: loadingCoaches, coaches } = useTracker(() => {
    if (!coachIds.current?.length) {
      console.log('empty')
      return { loading: false }
    }
    console.log('subscribe members.byIds', coachIds.current)
    const sub = Meteor.subscribe('members.byIds', coachIds.current)
    return {
      loading: !sub.ready(),
      coaches: Members.find({ _id: { $in: coachIds.current } }).fetch(),
    }
  }, [coachIds.current])
  console.log('coaches', coaches)

  const { loading: loadingCourses, courses } = useTracker(() => {
    if (!courseIds.current?.length) {
      return { loading: false }
    }
    const sub = Meteor.subscribe('courses.byIds', courseIds.current)
    return {
      loading: !sub.ready(),
      courses: Courses.find({ _id: { $in: courseIds.current } }).fetch(),
    }
  }, [courseIds.current])
  console.log('courses', courses)

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
  }, [recentSessions, upcomingSessions, events, courses, coaches])

  return (
    <MySessionsContext.Provider
      value={{
        loadingEvents,
        loadingCoaches,
        loadingCourses,
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
