import { Meteor } from 'meteor/meteor'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import Events from '/imports/api/events/schema.js'
import Profiles from '/imports/api/profiles/schema.js'
import Bookings from '/imports/api/bookings/schema.js'
import Locations from '/imports/api/locations/schema.js'

export const MySessionsContext = React.createContext('my-sessions')

export const MySessionsProvider = (props) => {
  const { children } = props

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  // const [recentBookingsWData, setRecentBookingsWData] = useState([])
  // const [upcomingBookingsWData, setUpcomingBookingsWData] = useState([])

  const getCoachByCoachId = (coachId) => {
    return Profiles.findOne({ _id: coachId })
  }

  const getLocationById = (locationId) => {
    return Locations.findOne({ _id: locationId })
  }

  const getEventById = (eventId) => {
    const event = Events.findOne({ _id: eventId })
    if (event) {
      event.coach = getCoachByCoachId(event.coachId)
      event.locationDoc = getLocationById(event.locationId)
      event.backupLocationDoc = getLocationById(event.backupLocationId)
    }
    return event
  }

  const { loadingRecentBookings, recentBookings = [] } = useTracker(() => {
    const sub = Meteor.subscribe('sessions.myRecent', {})
    return {
      loadingRecentBookings: !sub.ready(),
      recentBookings: Bookings.find(
        { bookedDate: { $lt: new Date() } },
        { sort: { bookedDate: -1 } }
      ).fetch(),
    }
  }, [])

  const { loadingUpcomingBookings, upcomingBookings = [] } = useTracker(() => {
    const sub = Meteor.subscribe('sessions.myUpcoming')
    return {
      loadingUpcomingBookings: !sub.ready(),
      upcomingBookings: Bookings.find(
        { bookedDate: { $gt: new Date() } },
        { sort: { bookedDate: 1 } }
      ).fetch(),
    }
  }, [])

  const eventIds = useMemo(() => {
    const newEventIds = []
    recentBookings?.map((item) => {
      if (!newEventIds.includes(item.eventId)) {
        newEventIds.push(item.eventId)
      }
    })
    upcomingBookings?.map((item) => {
      if (!newEventIds.includes(item.eventId)) {
        newEventIds.push(item.eventId)
      }
    })
    // console.log({ newEventIds })
    return newEventIds
  }, [
    recentBookings.length ? recentBookings : null,
    upcomingBookings.length ? upcomingBookings : null,
  ])

  const { loadingEvents = false, events = [] } = useTracker(() => {
    if (!eventIds.length) {
      return { loadingEvents: false }
    }
    const sub = Meteor.subscribe('events.byIds', eventIds)
    return {
      loadingEvents: !sub.ready(),
      events: Events.find({}).fetch(),
    }
  }, [eventIds.length ? eventIds : null])

  const { coachIds, locationIds } = useMemo(() => {
    const newCoachIds = []
    const newLocationIds = []
    events.map((item) => {
      if (!newCoachIds.includes(item.coachId)) {
        newCoachIds.push(item.coachId)
      }
      if (!newLocationIds.includes(item.locationId)) {
        newLocationIds.push(item.locationId)
      }
      if (item.backupLocationId && !newLocationIds.includes(item.backupLocationId)) {
        newLocationIds.push(item.backupLocationId)
      }
    })
    // console.log('update ccIds')
    return { coachIds: newCoachIds, locationIds: newLocationIds }
  }, [events.length ? events : null])

  const loadingCC = useTracker(() => {
    const coachSub = Meteor.subscribe('profiles.byIds', coachIds)
    const locationSub = Meteor.subscribe('locations.byIds', locationIds)
    return (
      !(coachSub ? coachSub.ready() : false) || !(locationSub ? locationSub.ready() : false)
    )
  }, [coachIds.length ? coachIds : null, locationIds.length ? locationIds : null])

  const recentBookingsWData = useMemo(() => {
    // console.log('build recentBookingsWData')
    return recentBookings?.map((item) => {
      const event = getEventById(item.eventId)
      return {
        ...item,
        event,
      }
    })
  }, [
    recentBookings.length ? recentBookings : null,
    events.length ? events : null,
    loadingCC,
  ])

  const upcomingBookingsWData = useMemo(() => {
    // console.log('build upcomingBookingsWData')
    return upcomingBookings?.map((item) => {
      const event = getEventById(item.eventId)
      return {
        ...item,
        event,
      }
    })
  }, [
    upcomingBookings.length ? upcomingBookings : null,
    events.length ? events : null,
    loadingCC,
  ])

  return (
    <MySessionsContext.Provider
      value={{
        loadingEvents,
        loadingCC,
        loadingRecentBookings,
        loadingUpcomingBookings,
        recentBookingsWData,
        upcomingBookingsWData,
        getEventById,
        getCoachByCoachId,
        getLocationById,
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
