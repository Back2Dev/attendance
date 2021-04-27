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

export const BookingsHistoryContext = React.createContext('bookingshistory')

export const BookingsHistoryProvider = (props) => {
  const { children } = props

  const { member } = useContext(AccountContext)

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  return (
    <BookingsHistoryContext.Provider value={{}}>
      {children}
    </BookingsHistoryContext.Provider>
  )
}

BookingsHistoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const BookingsHistoryConsumer = BookingsHistoryContext.Consumer
