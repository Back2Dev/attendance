import React, { useContext } from 'react'
import Button from '@material-ui/core/Button'
import { useForm } from 'uniforms'
import PropTypes from 'prop-types'

import { RegisterContext } from './context'

const StepButtons = ({ formRef }) => {
  const { activeStep, handleBack, handleNext, steps, updateStepsModel } = useContext(
    RegisterContext
  )
  const classes = { button: '' }
  const uniforms = useForm()
  const onNext = async (e) => {
    e.preventDefault()
    const res = await formRef.current?.validateModel(uniforms.model)
    if (!res) {
      updateStepsModel(uniforms.model)
      handleNext()
    }
  }

  const onBack = (e) => {
    e.preventDefault()
    updateStepsModel(uniforms.model)
    handleBack()
  }

  return (
    <div>
      <Button disabled={activeStep === 0} onClick={onBack} className={classes.button}>
        Back
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={onNext}
        className={classes.button}
      >
        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </div>
  )
}

StepButtons.propTypes = {
  formRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
}

export default StepButtons
