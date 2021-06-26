import React, { useReducer, createContext } from 'react'
import PropTypes from 'prop-types'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

export const RegisterContext = createContext()

const steps = ['About you', 'Contact', 'Emergency', 'Avatar', 'Confirm details']

const stepHeadings = [
  'Lets get to know each other',
  'Contact info & password',
  'Who should we contact in an emergency?',
  'Choose an avatar',
  'Confirm details',
]

const initialState = {
  models: Array(steps.length)
    .fill()
    .map(() => ({})),
  ui: {
    activeStep: 0,
    isFormUpdate: false,
    isStepEdit: false,
    isSubmitting: false,
    notification: {},
    showMessage: false,
  },
}

const reducer = (state, action) => {
  const {
    models,
    ui: { activeStep },
  } = state
  switch (action.type) {
    case 'go_next':
      return {
        models: models.map((model, idx) => (idx === activeStep ? action.model : model)),
        ui: { ...state.ui, activeStep: activeStep + 1 },
      }
    case 'go_back':
      return {
        models: models.map((model, idx) => (idx === activeStep ? action.model : model)),
        ui: { ...state.ui, activeStep: activeStep - 1 },
      }
    case 'go_last':
      return {
        models: models.map((model, idx) => (idx === activeStep ? action.model : model)),
        ui: { ...state.ui, isStepEdit: false, activeStep: steps.length - 1 },
      }
    case 'go_edit_step':
      return {
        ...state,
        ui: { ...state.ui, isStepEdit: true, activeStep: action.step },
      }
    case 'go_submit':
      return {
        models: models.map((model, idx) => (idx === activeStep ? action.model : model)),
        ui: { ...state.ui, isSubmitting: true },
      }
    case 'submit_success':
      return {
        ...state,
        ui: {
          ...state.ui,
          isSubmitting: false,
          activeStep: steps.length,
          showMessage: true,
          notification: { severity: 'success', message: 'Account created!' },
        },
      }
    case 'submit_fail':
      return {
        ...state,
        ui: {
          ...state.ui,
          isSubmitting: false,
          showMessage: true,
          notification: {
            severity: 'error',
            message: 'There was a problem creating the account',
          },
        },
      }
    case 'hide_message':
      return {
        ...state,
        ui: {
          ...state.ui,
          showMessage: false,
        },
      }
    case 'reset_steps':
      return initialState
    default:
      return state
  }
}

export const RegisterProvider = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [state, dispatch] = useReducer(reducer, initialState)
  const activeStep = state.ui.activeStep
  const activeModel = state.models[activeStep]
  const models = state.models
  const isSubmitting = state.ui.isSubmitting
  const notification = state.ui.notification
  const showMessage = state.ui.showMessage
  const isStepEdit = state.ui.isStepEdit

  return (
    <RegisterContext.Provider
      value={{
        steps,
        stepHeadings,
        activeStep,
        state,
        dispatch,
        activeModel,
        models,
        isSubmitting,
        notification,
        showMessage,
        isStepEdit,
        isMobile,
      }}
    >
      {children}
    </RegisterContext.Provider>
  )
}

RegisterProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
