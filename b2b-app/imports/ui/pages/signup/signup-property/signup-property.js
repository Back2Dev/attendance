import React from 'react'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'
import PropertyStep from './property-step.js'
import SignupStep from './signup-step.js'
import UploadStep from './upload-step.js'

const AddProperty = () => {
  const [activeStep, setActiveStep] = React.useState(0)

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <PropertyStep activeStep={activeStep} setActiveStep={setActiveStep} />
      case 1:
        return <SignupStep activeStep={activeStep} setActiveStep={setActiveStep} />
      case 2:
        return <UploadStep activeStep={activeStep} setActiveStep={setActiveStep} />
      default:
        return 'Unknown step'
    }
  }

  const renderForm = () => {
    return <>{getStepContent(activeStep)}</>
  }

  return <OnboardingModal renderForm={renderForm} />
}

export default AddProperty
