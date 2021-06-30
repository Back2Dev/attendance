import React, { useContext, useEffect } from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { meteorCall } from '/imports/ui/utils/meteor'
import { RegisterContext } from './context'
import { ContactForm, AboutForm, EmergencyForm, ConfirmForm } from './forms'

const useStyles = makeStyles((theme) => ({
  formHeading: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
}))

const formComponents = [ContactForm, AboutForm, EmergencyForm, ConfirmForm]

function getStepHeading(stepIndex) {
  switch (stepIndex) {
    case 0:
      return "Let's start with some basic contact details"
    case 1:
      return "Let's learn a bit about you"
    case 2:
      return 'Who should we contact in an emergency?'
    case 3:
      return "Just making sure everything's correct"
    default:
      return 'Unknown stepIndex'
  }
}

const StepBody = () => {
  const classes = useStyles()
  const { steps, activeStep, models, isEditingStep, isSubmitting, dispatch } = useContext(
    RegisterContext
  )

  useEffect(() => {
    const submitData = async () => {
      console.log('sending to server')
      if (!isSubmitting) return

      const s = await meteorCall(
        'insert.registrations',
        'saving',
        Object.assign({}, ...models)
      )

      if (s?.status === 'success') {
        dispatch({ type: 'submit_success' })
      } else if (s?.status === 'failure') {
        dispatch({ type: 'submit_fail' })
      }
    }
    submitData()
  }, [isSubmitting])

  const getForm = (index) => {
    let Form = formComponents[index]
    const handleSubmit = (model) => {
      if (isEditingStep) {
        dispatch({ type: 'go_last', model })
      } else if (activeStep === steps.length - 1) {
        dispatch({ type: 'go_submit', model })
      } else if (activeStep in steps) {
        dispatch({ type: 'go_next', model })
      }
    }

    return <Form onSubmit={handleSubmit} model={models[index]} />
  }
  return (
    <div>
      <Typography variant="h2" className={classes.formHeading}>
        {getStepHeading(activeStep)}
      </Typography>
      {getForm(activeStep)}
    </div>
  )
}

export default StepBody
