import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { AutoForm } from 'uniforms-material'

import { ContactForm } from './ContactForm'
import { AboutForm } from './AboutForm'
import { EmergencyForm } from './EmergencyForm'
import { Confirm } from './Confirm'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  formHeading: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
  stepper: {
    width: '80%',
    margin: 'auto',
  },
  stepContent: {
    width: '60%',
    margin: 'auto',
  },
  title: {
    textAlign: 'center',
    padding: '1em',
  },
}))

function getStepLabels() {
  return ['Contact details', 'About you', 'Emergency contact', 'Confirm']
}

function getStepHeading(stepIndex) {
  switch (stepIndex) {
    case 0:
      return "Let's learn a bit about you"
    case 1:
      return "Let's start with some basic contact details"
    case 2:
      return 'Who should we contact in an emergency?'
    case 3:
      return 'Just making sure everythings correct'
    default:
      return 'Unknown stepIndex'
  }
}

export default function Register() {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const steps = getStepLabels()

  const [contactFormModel, setContactFormModel] = React.useState({ name: 'andrew' })
  const [aboutFormModel, setAboutFormModel] = React.useState({})
  const [emergencyFormModel, setEmergencyFormModel] = React.useState({})
  const [termsFormModel, setTermsFormModel] = React.useState({})

  const models = [contactFormModel, aboutFormModel, emergencyFormModel, termsFormModel]
  const setters = [
    setContactFormModel,
    setAboutFormModel,
    setEmergencyFormModel,
    setTermsFormModel,
  ]
  const formComponents = [ContactForm, AboutForm, EmergencyForm, Confirm]

  const getForm = (index) => {
    let Form = formComponents[index]

    return <Form onSubmit={getSubmitHandler(index)} model={models[index]} />
  }

  const getSubmitHandler = (index) => {
    const handler = (model) => {
      setters[index](model)
    }

    return handler
  }

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
    <div className={classes.root}>
      <Typography variant="h1" className={classes.title}>
        Registration
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className={classes.stepContent}>
        {activeStep === steps.length ? (
          // What to display when completed all form steps
          <div>
            a<Typography className={classes.instructions}>All steps completed</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          // Display the appropriate form page
          <div>
            <Typography variant="h2" className={classes.formHeading}>
              {getStepHeading(activeStep)}
            </Typography>

            {/* TODO Display correct form and save to state on submit, incrementing stepper if successful */}
            {getForm(activeStep)}

            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
