import React, { useState, createContext } from 'react'
import PropTypes from 'prop-types'

export const RegisterContext = createContext()

function getSteps() {
  return ['About you', 'Contact', 'Emergency', 'Avatar', 'Create account']
}

export const RegisterProvider = ({ children }) => {
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()
  const [stepsModel, setStepsModel] = useState({})

  const updateStepsModel = (data) => {
    setStepsModel((prevModel) => ({ ...prevModel, [steps[activeStep]]: data }))
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setStepsModel({})
    setActiveStep(0)
  }

  return (
    <RegisterContext.Provider
      value={{
        stepsModel,
        updateStepsModel,
        steps,
        activeStep,
        handleNext,
        handleBack,
        handleReset,
      }}
    >
      {children}
    </RegisterContext.Provider>
  )
}

RegisterProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
