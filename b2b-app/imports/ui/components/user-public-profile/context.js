import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'

// import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

import Profiles from '/imports/api/profiles/schema.js'

export const PublicProfileContext = React.createContext('publicprofile')

export const PublicProfileProvider = (props) => {
  const { children } = props

  const { id } = useParams()

  // const { member } = useContext(AccountContext)

  const mounted = useRef(true)
  useEffect(
    () => () => {
      mounted.current = false
    },
    []
  )

  // first, get the session
  const { loading, member } = useTracker(() => {
    const sub = Meteor.subscribe('profiles.publicProfile', id)
    return {
      loading: !sub.ready(),
      member: Profiles.findOne({ _id: id }),
    }
  }, [id])

  return (
    <PublicProfileContext.Provider
      value={{
        loading,
        member,
      }}
    >
      {children}
    </PublicProfileContext.Provider>
  )
}

PublicProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const PublicProfileConsumer = PublicProfileContext.Consumer
