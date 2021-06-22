import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { useForm } from 'uniforms'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'

import { RegisterContext } from './context'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    gridArea: 'stepButtons',
  },
}))

const StepButtons = ({ formRef }) => {
  const { activeStep, handleBack, handleNext, steps, updateStepsModel } = useContext(
    RegisterContext
  )
  const classes = useStyles()
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
    <Grid container justify="space-between" className={classes.root}>
      <Grid item>
        <Button disabled={activeStep === 0} onClick={onBack} className={classes.button}>
          Back
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={onNext}
          className={classes.button}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Grid>
    </Grid>
  )
}

StepButtons.propTypes = {
  formRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
}

export default StepButtons
