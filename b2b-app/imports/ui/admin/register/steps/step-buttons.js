import React, { useContext } from 'react'
import Button from '@material-ui/core/Button'
import { useForm } from 'uniforms'
import { RegisterContext } from './context'

const StepButtons = () => {
  const { activeStep, handleBack, handleNext, steps } = useContext(RegisterContext)
  const classes = { button: '' }
  const uniforms = useForm()
  console.log('uniforms', uniforms.model)
  return (
    <div>
      <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
        Back
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleNext}
        className={classes.button}
      >
        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </div>
  )
}

export default StepButtons
