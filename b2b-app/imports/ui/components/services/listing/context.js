import { Meteor } from 'meteor/meteor'
import React, { useReducer, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import Jobs from '/imports/api/jobs/schema.js'
import { parseISO } from 'date-fns'

export const JobsListingContext = React.createContext('jobslisting')

const CACHED_FILTERS_KEY = 'jobs-filters'

function reducer(state, action) {
  const setCachedFilter = (newFilters) => {
    localStorage.setItem(CACHED_FILTERS_KEY, JSON.stringify(newFilters))
  }

  const { type, payload } = action
  switch (type) {
    case 'setFilterText': {
      const newState = { ...state, filterText: payload.text }
      setCachedFilter(newState)
      return newState
    }
    case 'setFilterStatus': {
      const newState = { ...state, filterStatus: payload.status }
      setCachedFilter(newState)
      return newState
    }
    case 'setDateFrom': {
      const newState = { ...state, dateFrom: payload.dateFrom }
      setCachedFilter(newState)
      return newState
    }
    case 'setDateTo': {
      const newState = { ...state, dateTo: payload.dateTo }
      setCachedFilter(newState)
      return newState
    }
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

  const cachedFiltersString = localStorage.getItem(CACHED_FILTERS_KEY)
  const cachedFilters = cachedFiltersString ? JSON.parse(cachedFiltersString) : {}

  const [state, dispatch] = useReducer(reducer, {
    filterText: cachedFilters.filterText || '',
    filterStatus: cachedFilters.filterStatus || [],
    dateFrom: (cachedFilters.dateFrom && parseISO(cachedFilters.dateFrom)) || null,
    dateTo: (cachedFilters.dateTo && parseISO(cachedFilters.dateTo)) || null,
  })

  const { loading, jobs, statusCounter } = useTracker(() => {
    // TODO: change the subscription, add permission checking
    const sub = Meteor.subscribe('all.jobs')
    const jobs = Jobs.find({}, { sort: { pickupDate: -1 } }).fetch()
    const statusCounter = {}
    jobs.map((job) => {
      statusCounter[job.status] = (statusCounter[job.status] || 0) + 1
    })

    return {
      loading: !sub.ready(),
      jobs,
      statusCounter,
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

  const setDateFrom = (date) => {
    dispatch({ type: 'setDateFrom', payload: { dateFrom: date } })
  }
  const setDateTo = (date) => {
    dispatch({ type: 'setDateTo', payload: { dateTo: date } })
  }

  return (
    <JobsListingContext.Provider
      value={{
        ...state,
        loading,
        jobs,
        statusCounter,
        toggleFilterStatus,
        setFilterText,
        setDateFrom,
        setDateTo,
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
