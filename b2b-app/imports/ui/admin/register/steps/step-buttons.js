import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useForm } from 'uniforms'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import PropTypes from 'prop-types'

import { RegisterContext } from './context'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    gridArea: 'stepButtons',
  },
  wrapper: {
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
  },
}))

const StepButtons = ({ formRef }) => {
  const { activeStep, steps, dispatch, isSubmitting } = useContext(RegisterContext)
  const classes = useStyles()
  const uniforms = useForm()
  const onNext = async () => {
    const res = await formRef.current?.validateModel(uniforms.model)
    if (!res) {
      if (activeStep === steps.length - 1) {
        dispatch({ type: 'go_submit', model: uniforms.model })
        try {
          // send data to backend here
          // simulate a failed/successful submit
          await new Promise((resolve, reject) => {
            setTimeout(() => (Math.random() > 0.5 ? resolve() : reject()), 2000)
          })
          dispatch({ type: 'submit_success' })
        } catch (e) {
          dispatch({ type: 'submit_fail' })
        }
      } else {
        dispatch({ type: 'go_next', model: uniforms.model })
      }
    }
  }
  const onBack = () => {
    dispatch({ type: 'go_back', model: uniforms.model })
  }

  return (
    <Grid container justify="space-between" className={classes.root}>
      <Grid item>
        <Button disabled={activeStep === 0} onClick={onBack} className={classes.button}>
          Back
        </Button>
      </Grid>
      <Grid item className={classes.wrapper}>
        <Button
          variant="contained"
          color="primary"
          onClick={onNext}
          className={classes.button}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Creating account'
            : activeStep === steps.length - 1
            ? 'Finish'
            : 'Next'}
        </Button>
        <Fade
          className={classes.progress}
          in={isSubmitting}
          style={{
            transitionDelay: isSubmitting ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <CircularProgress size={24} />
        </Fade>
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
