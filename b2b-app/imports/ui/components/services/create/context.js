import { Meteor } from 'meteor/meteor'
import React, { useReducer, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useParams } from 'react-router-dom'
import { useTracker } from 'meteor/react-meteor-data'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

import Jobs from '/imports/api/jobs/schema.js'
import createJobCard from '/imports/ui/utils/job-card-pdf.js'

export const ServiceContext = React.createContext('service')

const stepKeys = ['service', 'bike', 'contact']
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
      console.log('setStepData', stepKey, data)
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
  const { id: jobId } = useParams()
  console.log({ jobId })

  const mounted = useRef(true)
  useEffect(
    () => () => {
      mounted.current = false
    },
    []
  )

  const [state, dispatch] = useReducer(reducer, {
    steps: {
      service: {
        label: 'Service',
        error: false,
        disabled: false,
        completed: false,
        lastMessage: '',
        data: null,
      },
      bike: {
        label: 'Bike',
        error: false,
        disabled: false,
        completed: false,
        lastMessage: '',
        data: null,
      },
      contact: {
        label: 'Contact',
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

  // bind job data to state
  const { job: originalData } = useTracker(() => {
    if (jobId) {
      const sub = Meteor.subscribe('id.jobs', jobId)
      return {
        loading: !sub.ready(),
        job: Jobs.findOne({ _id: jobId }),
      }
    }
    return {}
  }, [jobId])

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

  const createPdf = (jobNo) => {
    const serviceType = state.steps.service.data.serviceType
    const serviceItems = state.steps.service.data.items
    const bikeDetails = state.steps.bike.data.details
    const contactData = state.steps.contact.data
    // const pickup = state.steps.pickup.data.pickup
    const theJobNo = jobNo || originalData.jobNo
    const assessor = state.steps.bike.data.details.assessor

    createJobCard({ serviceType, serviceItems, bikeDetails, contactData, assessor, jobNo: theJobNo })
  }

  const createJob = (quick = false) => {
    // check if all steps are completed
    let allDone = true
    Object.keys(state.steps).map((stepKey) => {
      if (!state.steps[stepKey].completed) {
        allDone = false
        console.log(`${stepKey} is not done`)
      }
      return stepKey
    })
    if (!allDone) {
      showError('Please finish all steps first')
      return
    }

    if (!mounted.current) {
      return
    }
    dispatch({ type: 'setLoading', payload: true })
    const contactData = state.steps.contact.data
    if (!contactData.refurbish) {
      delete contactData.selectedMember?.history
      delete contactData.memberData?.history
    }

    const data = {
      serviceType: state.steps.service.data.serviceType,
      serviceItems: state.steps.service.data.items,
      assessor: state.steps.service.data.assessor,
      note: state.steps.service.data.note,
      bikeDetails: state.steps.bike.data.details,
      refurbish: contactData.refurbish,
      selectedMember: contactData.selectedMember,
      memberData: contactData.refurbish ? undefined : contactData.memberData,
    }

    if (originalData) {
      data.jobId = originalData._id
    }

    Meteor.call(originalData ? 'jobs.update' : 'jobs.create', data, (error, result) => {
      if (mounted.current) {
        dispatch({ type: 'setLoading', payload: false })
      }
      if (error) {
        showError(error.message)
      }
      if (result) {
        if (result.status === 'success') {
          showSuccess(`Job ${originalData ? 'updated' : 'created'} successfully`)
          // push(`/jobs/${result.id}`)
          // create pdf now?
          if (quick === false) {
            createPdf(result.jobNo)
          }

          if (originalData) {
            // redirect to job details
            push(`/services/${originalData._id}`)
          } else {
            // redirect to jobs listing
            push('/services')
          }
        } else {
          showError(
            `Error ${originalData ? 'updating' : 'creating'} job: ${result.message}`
          )
        }
      }
    })
  }

  return (
    <ServiceContext.Provider
      value={{
        ...state,
        jobId,
        originalData,
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
