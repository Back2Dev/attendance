import { useReducer } from 'react'

const init = (steps) => ({
  models: Array(steps)
    .fill()
    .map(() => ({})),
  ui: {
    activeStep: 0,
    isEditingStep: false,
    isSubmitting: false,
  },
})

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
        ui: { ...state.ui, isEditingStep: false, activeStep: models.length - 1 },
      }
    case 'go_submit':
      return {
        models: models.map((model, idx) => (idx === activeStep ? action.model : model)),
        ui: { ...state.ui, isSubmitting: true },
      }
    case 'go_edit_step':
      return {
        ...state,
        ui: { ...state.ui, isEditingStep: true, activeStep: action.step },
      }
    case 'submit_success':
      return {
        ...state,
        ui: {
          ...state.ui,
          isSubmitting: false,
          activeStep: models.length,
        },
      }
    case 'submit_fail':
      return {
        ...state,
        ui: {
          ...state.ui,
          isSubmitting: false,
        },
      }
    case 'go_reset':
      return init(models.length)
    default:
      throw new Error('Invalid action type')
  }
}

const useRegisterReducer = (steps) => {
  const [{ models, ui }, dispatch] = useReducer(reducer, steps, init)
  const { activeStep, isEditingStep, isSubmitting } = ui
  return [{ activeStep, models, isEditingStep, isSubmitting }, dispatch]
}

export default useRegisterReducer
