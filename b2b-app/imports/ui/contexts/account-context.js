import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import React from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import Profiles from '/imports/api/members/schema.js'

export const AccountContext = React.createContext('account')

export const AccountProvider = (props) => {
  const { children } = props

  const { loading, user } = useTracker(() => {
    if (Meteor.isServer) {
      return { loading: false, user: null }
    }
    const sub = Meteor.subscribe('currentUser')
    return { loading: !sub.ready(), user: Meteor.user() }
  }, [])

  const { loadingProfile, profile } = useTracker(() => {
    if (!user || Meteor.isServer) {
      return { loadingProfile: false, profile: null }
    }
    const sub = Meteor.subscribe('currentProfile')
    return {
      loadingProfile: !sub.ready(),
      profile: Profiles.findOne({ userId: user._id }),
    }
  }, [user])

  const account = {
    isLoggedIn: !!user,
    currentUser: user,
    loading,
    loadingProfile,
    user,
    profile,
    viewas: Session.get('viewas'),
  }

  /**
   * Set the viewas session and viewas var in account context
   * @param {string} role
   * @return {Object} result
   */
  const setViewas = (role) => {
    // check if the role is vailable for this current user
    if (!user) {
      return { status: 'failed', message: 'Please login' }
    }
    const hasRole = user.roles.some((item) => item._id === role)
    if (!hasRole) {
      return { status: 'failed', message: `The role ${role} is not available` }
    }
    Session.set('viewas', role)
    return { status: 'success' }
  }

  return (
    <AccountContext.Provider value={{ ...account, setViewas }}>
      {children}
    </AccountContext.Provider>
  )
}

AccountProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const AccountConsumer = AccountContext.Consumer
