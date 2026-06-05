import { Meteor } from 'meteor/meteor'
import React, { useContext, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Events from '/imports/api/events/schema.js'
import Profiles from '/imports/api/profiles/schema.js'
import Bookings from '/imports/api/bookings/schema.js'
import Locations from '/imports/api/locations/schema.js'

export const BookingsHistoryContext = React.createContext('bookingshistory')

export const BookingsHistoryProvider = (props) => {
  const { children } = props

  const { member } = useContext(AccountContext)
  const [sessionsWData, setSessionsWData] = useState([])

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const [eventIds, setEventIds] = useState([])
  const [coachIds, setCoachIds] = useState([])
  const [courseIds, setCourseIds] = useState([])

  const getCoachByCoachId = (coachId) => {
    return Profiles.findOne({ _id: coachId })
  }

  const getCourseByCourseId = (courseId) => {
    return Locations.findOne({ _id: courseId })
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

  const { loadingBookings, bookings = [] } = useTracker(() => {
    const sub = Meteor.subscribe('sessions.myAll', {})
    const bookings = Bookings.find(
      { profileId: member._id },
      { sort: { bookedDate: -1 } }
    ).fetch()
    return {
      loadingBookings: !sub.ready(),
      bookings,
      // bookings: bookings.length ? booking : null,
    }
  }, [])

  useEffect(() => {
    // console.log({ bookings })
    const newEventIds = []
    bookings.map((item) => {
      if (!newEventIds.includes(item.eventId)) {
        newEventIds.push(item.eventId)
      }
    })
    // console.log('update eventIds')
    setEventIds(newEventIds)
  }, [bookings.length ? bookings : null])

  const { loadingEvents = false, events = [] } = useTracker(() => {
    // console.log({ eventIds })
    if (!eventIds.length) {
      return { loadingEvents: false }
    }
    const sub = Meteor.subscribe('events.byIds', eventIds)
    const events = Events.find({}).fetch()
    return {
      loadingEvents: !sub.ready(),
      events,
      // events: events.length ? events : null,
    }
  }, [eventIds.length ? eventIds : null])

  useEffect(() => {
    // console.log({ events })
    const newCoachIds = []
    const newCourseIds = []
    events?.map((item) => {
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
    // console.log('update ccIds')
    setCoachIds(newCoachIds)
    setCourseIds(newCourseIds)
  }, [events.length ? events : null])

  const loadingCC = useTracker(() => {
    let coachSub
    let courseSub
    if (coachIds.length) {
      coachSub = Meteor.subscribe('profiles.byIds', coachIds)
    }
    if (courseIds.length) {
      courseSub = Meteor.subscribe('courses.byIds', courseIds)
    }
    const loadingCC =
      !(coachSub ? coachSub.ready() : false) || !(courseSub ? courseSub.ready() : false)
    // console.log({ coachIds, courseIds, loadingCC })
    return loadingCC
  }, [coachIds.length ? coachIds : null, courseIds.length ? courseIds : null])

  useEffect(() => {
    if (!events?.length) {
      return
    }
    const newData = bookings?.map((item) => {
      const event = getEventById(item.eventId)
      return {
        ...item,
        event,
      }
    })
    // console.log('update sessionsWData')
    setSessionsWData(newData)
  }, [bookings.length ? bookings : null, events.length ? events : null, loadingCC])

  return (
    <BookingsHistoryContext.Provider
      value={{
        loadingBookings,
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
