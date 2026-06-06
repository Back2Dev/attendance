import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'

// import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

// import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Events from '/imports/api/events/schema.js'
import Bookings from '/imports/api/bookings/schema.js'
import Locations from '../../../api/locations/schema'

export const SessionDetailsContext = React.createContext('sessiondetails')

export const SessionDetailsProvider = (props) => {
  const { children } = props

  const { id } = useParams()

  // const { member } = useContext(AccountContext)

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  // first, get the session
  const { loading, session } = useTracker(() => {
    const sub = Meteor.subscribe('sessions.myByIdComposite', id)
    return {
      loading: !sub.ready(),
      session: Bookings.findOne({ _id: id }),
    }
  }, [id])

  const event = useTracker(() => {
    if (!session?.eventId) {
      return null
    }
    return Events.findOne({
      _id: session.eventId,
      status: { $in: ['active', 'cancelled'] },
    })
  }, [session?.eventId])

  const course = useTracker(() => {
    if (!event?.locationId) {
      return null
    }
    return Locations.findOne({
      _id: event.locationId
    })
  },[event?.locationId])

  return (
    <SessionDetailsContext.Provider
      value={{
        loading,
        session,
        event,
        course
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
