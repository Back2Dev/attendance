import React, { useState, createContext } from 'react'

export const RegisterContext = createContext()

function getSteps() {
  return ['About you', 'Contact', 'Emergency', 'Avatar', 'Create account']
}

export const RegisterProvider = ({ children }) => {
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <RegisterContext.Provider
      value={{
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
