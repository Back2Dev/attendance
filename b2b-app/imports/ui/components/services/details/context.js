import { Meteor } from 'meteor/meteor'
import React, { useReducer, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'
import Jobs from '/imports/api/jobs/schema.js'

export const JobsDetailsContext = React.createContext('jobsdetails')

function reducer(state, action) {
  switch (action.type) {
    // case 'setLoading':
    //   return { ...state, loading: action.loading }
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
    // loading: false,
  })

  const { loading, item } = useTracker(() => {
    // TODO: change the subscription, add permission checking
    const sub = Meteor.subscribe('id.jobs', id)
    return {
      loading: !sub.ready(),
      item: Jobs.findOne({ _id: id }),
    }
  }, [])

  return (
    <JobsDetailsContext.Provider
      value={{
        ...state,
        loading,
        item,
      }}
    >
      {children}
    </JobsDetailsContext.Provider>
  )
}

JobsDetailsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

JobsDetailsProvider.defaultProps = {
  service: null,
}

export const JobsDetailsConsumer = JobsDetailsContext.Consumer
