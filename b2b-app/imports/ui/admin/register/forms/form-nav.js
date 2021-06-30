import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Fade, CircularProgress } from '@material-ui/core'
import { useForm } from 'uniforms'

const useStyles = makeStyles((theme) => ({
  buttonGroup: {
    width: '100%',
  },
  formButtons: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  wrapper: {
    display: 'inline-block',
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

const FormNav = ({ onBack, isEditingStep, isSubmitting }) => {
  const classes = useStyles()
  const { model } = useForm()

  return (
    <div className={classes.buttonGroup}>
      <div style={{ direction: 'rtl' }}>
        <div className={classes.wrapper}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.formButtons}
            disabled={isSubmitting}
          >
            {isEditingStep ? 'Last' : 'Submit'}
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
        {!isEditingStep && onBack && (
          <Button
            onClick={() => onBack(model)}
            className={(classes.formButtons, classes.backButton)}
          >
            Back
          </Button>
        )}
      </div>
    </div>
  )
}

FormNav.propTypes = {
  onBack: PropTypes.func,
  isEditingStep: PropTypes.bool,
  isSubmitting: PropTypes.bool,
}

export default FormNav
