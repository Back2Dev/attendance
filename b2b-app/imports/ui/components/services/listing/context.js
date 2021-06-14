import { Meteor } from 'meteor/meteor'
import React, { useReducer, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'
import Jobs from '/imports/api/jobs/schema.js'

export const JobsListingContext = React.createContext('jobslisting')

function reducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setFilterText':
      return { ...state, filterText: payload.text }
    case 'setFilterStatus':
      return { ...state, filterStatus: payload.status }
    default:
      return state
  }
}

export const JobsListingProvider = ({ children }) => {
  const mounted = useRef(true)
  useEffect(
    () => () => {
      mounted.current = false
    },
    []
  )

  const [state, dispatch] = useReducer(reducer, {
    filterText: '',
    filterStatus: [],
  })

  const { loading, jobs } = useTracker(() => {
    // TODO: change the subscription, add permission checking
    const sub = Meteor.subscribe('all.jobs')
    return {
      loading: !sub.ready(),
      jobs: Jobs.find({}).fetch(),
    }
  }, [])

  const toggleFilterStatus = (status) => {
    const isActive = state.filterStatus.includes(status)
    if (isActive) {
      const newFilterStatus = []
      state.filterStatus.map((item) => {
        if (item !== status) {
          newFilterStatus.push(item)
        }
      })
      dispatch({ type: 'setFilterStatus', payload: { status: newFilterStatus } })
    } else {
      dispatch({
        type: 'setFilterStatus',
        payload: { status: [...state.filterStatus, status] },
      })
    }
  }

  const setFilterText = (text) => {
    dispatch({ type: 'setFilterText', payload: { text } })
  }

  return (
    <JobsListingContext.Provider
      value={{
        ...state,
        loading,
        jobs,
        toggleFilterStatus,
        setFilterText,
      }}
    >
      {children}
    </JobsListingContext.Provider>
  )
}

JobsListingProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

JobsListingProvider.defaultProps = {
  service: null,
}

export const JobsListingConsumer = JobsListingContext.Consumer
