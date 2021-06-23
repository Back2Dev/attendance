import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Paper from '@material-ui/core/Paper'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

import { About, Contact, Emergency, Avatar, Terms } from './steps'
import { RegisterProvider, RegisterContext } from './steps/context'

const useStyles = makeStyles((theme) => ({
  root: {
    '& form': {
      maxWidth: 600,
      margin: '0 auto',
      display: ({ bp }) => (bp ? 'grid' : 'block'),
      columnGap: theme.spacing(2),
    },
  },
  h1: {
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(3),
  },
  h2: {
    marginBottom: theme.spacing(2),
  },
  registerBody: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(5),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  formData: {
    maxWidth: ({ bp }) => (bp ? '75%' : '100%'),
  },
  form: {
    maxWidth: 600,
  },
}))

function getStepContent(step, initialData) {
  const StepForm = [About, Contact, Emergency, Avatar, Terms][step]
  return <StepForm initialData={initialData} />
}

export default function Register() {
  const theme = useTheme()
  const bp = useMediaQuery(theme.breakpoints.up('md'))
  const classes = useStyles({ bp })

  return (
    <Container className={classes.root}>
      <RegisterProvider>
        <RegisterContext.Consumer>
          {({ activeStep, steps, handleReset, stepsModel, stepHeadings }) => (
            <>
              <Typography variant="h1" align="center" className={classes.h1}>
                Register a new account
              </Typography>
              <Stepper
                activeStep={activeStep}
                orientation={bp ? 'horizontal' : 'vertical'}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    {!bp ? (
                      <StepContent>
                        {getStepContent(activeStep, stepsModel[steps[activeStep]])}
                      </StepContent>
                    ) : (
                      ''
                    )}
                  </Step>
                ))}
              </Stepper>
              {bp || activeStep === steps.length ? (
                <Paper variant="outlined" className={classes.registerBody} square>
                  {activeStep === steps.length ? (
                    <div>
                      <Typography className={classes.instructions}>
                        All steps completed - you&apos;re finished
                      </Typography>
                      <Card className={classes.formData}>
                        <CardHeader title="Form data to be sent to server" />
                        <CardContent>
                          <pre>
                            {JSON.stringify(
                              steps.slice(0, -1).reduce(
                                (formData, key) => ({
                                  ...formData,
                                  ...stepsModel[key],
                                }),
                                {}
                              ),
                              null,
                              2
                            )}
                          </pre>
                        </CardContent>
                      </Card>
                      <Button onClick={handleReset} className={classes.button}>
                        Reset
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Typography
                        variant="h2"
                        className={classes.h2}
                        align="center"
                        color="textSecondary"
                      >
                        {stepHeadings[activeStep]}
                      </Typography>
                      {getStepContent(activeStep, stepsModel[steps[activeStep]])}
                    </div>
                  )}
                </Paper>
              ) : (
                ''
              )}
            </>
          )}
        </RegisterContext.Consumer>
      </RegisterProvider>
    </Container>
  )
}
