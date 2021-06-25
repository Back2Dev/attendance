import React, { useContext } from 'react'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { RegisterContext } from './steps/context'

const useStyles = makeStyles((theme) => ({
  registerBody: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(5),
  },
  finishedHeader: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  resetButton: {
    marginTop: theme.spacing(2),
  },
}))

const StepsDone = () => {
  const classes = useStyles()
  const { models, dispatch, activeStep, steps } = useContext(RegisterContext)

  if (activeStep !== steps.length) {
    return null
  }

  return (
    <Paper variant="outlined" className={classes.registerBody} square>
      <Typography className={classes.finishedHeader}>
        All steps completed - you&apos;re finished
      </Typography>
      <Card className={classes.formData}>
        <CardHeader title="Form data to be sent to server" />
        <CardContent>
          <pre>
            {JSON.stringify(
              models
                .slice(0, -1)
                .reduce((payload, model) => ({ ...payload, ...model }), {}),
              null,
              2
            )}
          </pre>
        </CardContent>
      </Card>
      <Button
        onClick={() => dispatch({ type: 'reset_steps' })}
        className={classes.resetButton}
      >
        Reset
      </Button>
    </Paper>
  )
}

export default StepsDone
