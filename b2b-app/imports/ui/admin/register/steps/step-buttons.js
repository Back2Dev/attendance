import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useForm } from 'uniforms'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fade from '@material-ui/core/Fade'
import PropTypes from 'prop-types'

import { RegisterContext } from './context'

const useStyles = makeStyles((theme) => ({
  root: {
    display: ({ isStepEdit }) => (isStepEdit ? 'block' : 'flex'),
    position: 'relative',
    justifyContent: 'space-between',
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
  lastButton: {
    position: 'absolute',
    right: 0,
  },
}))

const StepButtons = ({ formRef }) => {
  const { activeStep, steps, dispatch, isSubmitting, isStepEdit } = useContext(
    RegisterContext
  )
  const classes = useStyles(isStepEdit)
  const uniforms = useForm()
  const onNext = async () => {
    const cleanModel = uniforms.schema.schema.clean(uniforms.model)
    const res = await formRef.current?.validateModel(cleanModel)
    if (!res) {
      if (isStepEdit) {
        dispatch({ type: 'go_last', model: cleanModel })
      } else if (activeStep === steps.length - 1) {
        dispatch({ type: 'go_submit', model: cleanModel })
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
        dispatch({ type: 'go_next', model: cleanModel })
      }
    }
  }
  const onBack = () => {
    dispatch({ type: 'go_back', model: uniforms.model })
  }

  return (
    <div className={classes.root}>
      {isStepEdit ? (
        <Button
          onClick={onNext}
          variant="contained"
          color="primary"
          className={classes.lastButton}
        >
          Last
        </Button>
      ) : (
        <>
          <Button disabled={activeStep === 0} onClick={onBack}>
            Back
          </Button>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              onClick={onNext}
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
          </div>
        </>
      )}
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
