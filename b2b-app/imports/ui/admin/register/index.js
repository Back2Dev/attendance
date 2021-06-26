import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Typography from '@material-ui/core/Typography'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

import { RegisterProvider, RegisterContext } from './steps/context'
import StepBody from './step-body'
import StepsDone from './steps-done'

const useStyles = makeStyles((theme) => ({
  root: {
    '& form': {
      maxWidth: 600,
      margin: '0 auto',
      display: 'block',
      columnGap: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        display: 'grid',
      },
    },
  },
  h1: {
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(3),
  },
}))

const Register = () => {
  const classes = useStyles()

  return (
    <Container className={classes.root}>
      <RegisterProvider>
        <RegisterContext.Consumer>
          {({ activeStep, dispatch, steps, notification, showMessage, isMobile }) => (
            <>
              <Snackbar
                open={showMessage}
                autoHideDuration={6000}
                onClose={() => dispatch({ type: 'hide_message' })}
              >
                <MuiAlert
                  variant="filled"
                  elevation={6}
                  onClose={() => dispatch({ type: 'hide_message' })}
                  severity={notification.severity}
                >
                  {notification.message}
                </MuiAlert>
              </Snackbar>
              <Typography variant="h1" align="center" className={classes.h1}>
                Register a new account
              </Typography>
              <Stepper
                activeStep={activeStep}
                orientation={isMobile ? 'vertical' : 'horizontal'}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    {isMobile && <StepBody isMobile />}
                  </Step>
                ))}
              </Stepper>
              {!isMobile && <StepBody />}
              <StepsDone />
            </>
          )}
        </RegisterContext.Consumer>
      </RegisterProvider>
    </Container>
  )
}

export default Register
