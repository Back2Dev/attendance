import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'

// import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

// import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Events from '/imports/api/events/schema.js'
import Sessions from '/imports/api/sessions/schema.js'

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
      session: Sessions.findOne({ _id: id }),
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

  return (
    <SessionDetailsContext.Provider
      value={{
        loading,
        session,
        event,
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
