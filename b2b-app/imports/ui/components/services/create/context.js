import { Meteor } from 'meteor/meteor'
import React, { useReducer, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

export const ServiceContext = React.createContext('service')

const stepKeys = ['service', 'bike', 'contact', 'pickup']
const stepProperties = ['laber', 'error', 'completed', 'disabled', 'lastMessage']

function reducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setActiveStep':
      if (stepKeys.indexOf(payload) !== -1) {
        return { ...state, activeStep: payload }
      }
      return state
    case 'setStepProperty': {
      const { stepKey, property, value } = payload
      if (stepKeys.indexOf(stepKey) === -1) {
        console.log('stepKey was not found', stepKey)
        return state
      }
      if (stepProperties.indexOf(property) === -1) {
        console.log('property was not found', property)
        return state
      }
      const step = state.steps[stepKey]
      if (!step) {
        return state
      }
      step[property] = value
      // console.log('update step', step);
      return {
        ...state,
        steps: {
          ...state.steps,
          [stepKey]: step,
        },
      }
    }
    case 'setStepData': {
      const { stepKey, data } = payload
      if (stepKeys.indexOf(stepKey) === -1) {
        console.log('stepKey was not found', stepKey)
        return state
      }
      const step = state.steps[stepKey]
      if (!step) {
        return state
      }
      step.data = data
      return {
        ...state,
        steps: {
          ...state.steps,
          [stepKey]: step,
        },
      }
    }
    case 'setLoading': {
      return {
        ...state,
        loading: payload,
      }
    }
    default:
      return state
  }
}

export const ServiceProvider = ({ children }) => {
  const { push } = useHistory()

  const mounted = useRef(true)
  useEffect(
    () => () => {
      mounted.current = false
    },
    []
  )

  // console.log('contract', contract);
  const [state, dispatch] = useReducer(reducer, {
    steps: {
      service: {
        label: 'New Service',
        error: false,
        disabled: false,
        completed: false,
        lastMessage: '',
        data: null,
      },
      bike: {
        label: 'Bike Details',
        error: false,
        disabled: false,
        completed: false,
        lastMessage: '',
        data: null,
      },
      contact: {
        label: 'Contact Details',
        error: false,
        disabled: false,
        completed: false,
        lastMessage: '',
        data: null,
      },
      pickup: {
        label: 'Pick-up Details',
        error: false,
        disabled: false,
        completed: false,
        lastMessage: '',
        data: null,
      },
    },
    activeStep: 'service', // for dev only, should be service by default
    loading: false,
  })

  // bind contract data to state
  // useEffect(() => {
  //   if (service) {
  //     dispatch({ type: 'setInitialData', payload: service });
  //   }
  // }, [service]);

  const setActiveStep = (stepKey) => {
    if (!mounted.current) {
      return
    }
    dispatch({ type: 'setActiveStep', payload: stepKey })
  }

  const goNext = () => {
    const currentStepIndex = stepKeys.indexOf(state.activeStep)
    if (currentStepIndex === -1 || currentStepIndex === stepKeys.length - 1) {
      return
    }
    const nextStepKey = stepKeys[currentStepIndex + 1]
    setActiveStep(nextStepKey)
  }

  const goBack = () => {
    const currentStepIndex = stepKeys.indexOf(state.activeStep)
    if (currentStepIndex <= 0) {
      return
    }
    const prevStepKey = stepKeys[currentStepIndex - 1]
    setActiveStep(prevStepKey)
  }

  const setStepData = ({ stepKey, data }) => {
    if (!mounted.current) {
      return
    }
    dispatch({ type: 'setStepData', payload: { stepKey, data } })
  }

  const setStepProperty = ({ stepKey, property, value }) => {
    if (!mounted.current) {
      return
    }
    dispatch({ type: 'setStepProperty', payload: { stepKey, property, value } })
  }

  const setNextStepProperty = ({ currentStepKey, property, value }) => {
    const stepKeyIndex = stepKeys.indexOf(currentStepKey) + 1
    if (stepKeyIndex < 1 || !stepKeys[stepKeyIndex]) {
      showError('Invalid next step')
      return null
    }
    return setStepProperty({ stepKey: stepKeys[stepKeyIndex], property, value })
  }

  const createJob = () => {
    // check if all steps are completed
    let allDone = true
    Object.keys(state.steps).map((stepKey) => {
      if (state.steps[stepKey].completed !== true) {
        allDone = false
      }
      return stepKey
    })
    if (allDone !== true) {
      showError('Please finish all steps first')
      return
    }

    if (!mounted.current) {
      return
    }
    dispatch({ type: 'setLoading', payload: true })
    const contactData = state.steps.contact.data
    delete contactData.selectedMember?.history
    delete contactData.memberData.history
    Meteor.call(
      'jobs.create',
      {
        serviceItems: state.steps.service.data.items,
        bikeDetails: state.steps.bike.data.details,
        selectedMember: contactData.selectedMember,
        memberData: contactData.memberData,
        pickup: state.steps.pickup.data.pickup,
      },
      (error, result) => {
        if (mounted.current) {
          dispatch({ type: 'setLoading', payload: false })
        }
        if (error) {
          showError(error.message)
        }
        if (result) {
          if (result.status === 'success') {
            showSuccess('Job created successfully')
            // push(`/jobs/${result.id}`)
          }
        }
      }
    )
  }

  return (
    <ServiceContext.Provider
      value={{
        ...state,
        setActiveStep,
        goNext,
        goBack,
        setStepData,
        setStepProperty,
        setNextStepProperty,
        createJob,
      }}
    >
      {children}
    </ServiceContext.Provider>
  )
}

ServiceProvider.propTypes = {
  service: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
  children: PropTypes.node.isRequired,
}

ServiceProvider.defaultProps = {
  service: null,
}

export const ServiceConsumer = ServiceContext.Consumer
