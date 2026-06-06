import { Meteor } from 'meteor/meteor'
import React, { useReducer, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'
import Jobs from '/imports/api/jobs/schema.js'

export const JobsDetailsContext = React.createContext('jobsdetails')

function reducer(state, action) {
  switch (action.type) {
    case 'setLoading':
      return { ...state, loading: action.loading }
    case 'setMechanics':
      return { ...state, mechanics: action.mechanics }
    default:
      return state
  }
}

export const JobsDetailsProvider = ({ children }) => {
  const mounted = useRef(true)
  useEffect(
    () => () => {
      mounted.current = false
    },
    []
  )
  const { id } = useParams()

  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    mechanics: [],
  })

  // load list of mechanics
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const result = await Meteor.callAsync('profiles.byRole', { role: 'MEC' })
        if (!isMounted) return
        if (result.status === 'failed') {
          showError(result.message)
          return
        }
        if (result.status === 'success') {
          dispatch({ type: 'setMechanics', mechanics: result.members })
        }
      } catch (error) {
        if (isMounted) {
          showError(error.message)
        }
      }
    })()
    return () => {
      isMounted = false
    }
  }, [])

  const { loading, item } = useTracker(() => {
    // TODO: change the subscription, add permission checking
    const sub = Meteor.subscribe('id.jobs', id)
    return {
      loading: !sub.ready(),
      item: Jobs.findOne({ _id: id }),
    }
  }, [])

  const updateJobStatus = async (status, history) => {
    dispatch({ type: 'setLoading', loading: true })
    try {
      const result = await Meteor.callAsync('jobs.updateStatus', {
        id: item._id,
        status,
        history,
      })
      if (result && result.status === 'failed') {
        showError(result.message)
      }
    } catch (error) {
      showError(error.message)
    } finally {
      if (mounted.current) {
        dispatch({ type: 'setLoading', loading: false })
      }
    }
  }

  const updateJobMechanic = async (mechanic) => {
    dispatch({ type: 'setLoading', loading: true })
    try {
      const result = await Meteor.callAsync('jobs.updateMechanic', {
        id: item._id,
        mechanic,
      })
      if (result && result.status === 'failed') {
        showError(result.message)
      }
    } catch (error) {
      showError(error.message)
    } finally {
      if (mounted.current) {
        dispatch({ type: 'setLoading', loading: false })
      }
    }
  }

  const markAsPaid = async () => {
    dispatch({ type: 'setLoading', loading: true })
    try {
      const result = await Meteor.callAsync('jobs.markAsPaid', { id: item._id })
      if (result && result.status === 'failed') {
        showError(result.message)
      }
    } catch (error) {
      showError(error.message)
    } finally {
      if (mounted.current) {
        dispatch({ type: 'setLoading', loading: false })
      }
    }
  }

  const markAsUnPaid = async () => {
    dispatch({ type: 'setLoading', loading: true })
    try {
      const result = await Meteor.callAsync('jobs.markAsUnPaid', { id: item._id })
      if (result && result.status === 'failed') {
        showError(result.message)
      }
    } catch (error) {
      showError(error.message)
    } finally {
      if (mounted.current) {
        dispatch({ type: 'setLoading', loading: false })
      }
    }
  }

  const addHistory = async (description, contacted = false) => {
    dispatch({ type: 'setLoading', loading: true })
    try {
      const result = await Meteor.callAsync('jobs.addHistory', {
        id: item._id,
        description,
        contacted,
      })
      if (result && result.status === 'failed') {
        showError(result.message)
      }
    } catch (error) {
      showError(error.message)
    } finally {
      if (mounted.current) {
        dispatch({ type: 'setLoading', loading: false })
      }
    }
  }

  const sendSMS = async (message) => {
    console.log('send sms', message)
    dispatch({ type: 'setLoading', loading: true })
    try {
      const result = await Meteor.callAsync('jobs.sendSMS', { id: item._id, message })
      if (result) {
        if (result.status === 'failed') {
          showError(result.message)
        }
        if (result.status === 'success') {
          showSuccess('SMS sent successfully')
        }
      }
    } catch (error) {
      showError(error.message)
    } finally {
      if (mounted.current) {
        dispatch({ type: 'setLoading', loading: false })
      }
    }
  }

  const setExpectedPickupDate = async (date) => {
    dispatch({ type: 'setLoading', loading: true })
    try {
      const result = await Meteor.callAsync('jobs.setExpectedPickupDate', {
        id: item._id,
        date,
      })
      if (result) {
        if (result.status === 'failed') {
          showError(result.message)
        }
        if (result.status === 'success') {
          showSuccess('Job updated')
        }
      }
    } catch (error) {
      showError(error.message)
    } finally {
      if (mounted.current) {
        dispatch({ type: 'setLoading', loading: false })
      }
    }
  }
  // TODO: Create the landing page for this
  const payUrl = Meteor.absoluteUrl(`/pay/${item?.jobNo}`)

  return (
    <JobsDetailsContext.Provider
      value={{
        ...state,
        loading: state.loading || loading,
        item,
        updateJobStatus,
        updateJobMechanic,
        markAsPaid,
        markAsUnPaid,
        addHistory,
        sendSMS,
        setExpectedPickupDate,
        payUrl,
      }}
    >
      {children}
    </JobsDetailsContext.Provider>
  )
}

JobsDetailsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}


export const JobsDetailsConsumer = JobsDetailsContext.Consumer
