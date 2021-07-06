// import React from 'react'


// export default Register = () => {
//   return <div>Registration page</div>
// }

import React from 'react'
// import InfoRegister from './create/InfoRegister'
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

function getSteps() {
  return ['Create account', 'Review']
}

function getStepContent(stepIndex) {
  const [newData, updateData] = React.useState('')
  const review = newData.map((data) => <li key={data.toString()}>{data}</li>)

  switch (stepIndex) {
    case 0:
      return '<InfoRegister submit={(data) => updateData(data)} />'
    case 1:
      return '<ul>{review}</ul>'
    default:
      return 'Unknown stepIndex'
  }
}

export default function HorizontalLabelPositionBelowStepper() {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)

  const steps = getSteps()

  const handleNext = () => {
    setActiveStep((activeStep) => activeStep + 1)
  }

  const handleBack = () => {
    setActiveStep((activeStep) => activeStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              Thank you for registering with us
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
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

export default function HorizontalLabelPositionBelowStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  
  const steps = getSteps();
 

  const handleNext = () => {
    setActiveStep((activeStep) => activeStep + 1);
    
  };

  const handleBack = () => {
    setActiveStep((activeStep) => activeStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            
          </Step>
        ))}
        
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>Thank you for registering with us</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
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
  );
}