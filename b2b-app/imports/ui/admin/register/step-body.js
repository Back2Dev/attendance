import React, { useContext } from 'react'
import { RegisterContext } from './steps/context'
import PropTypes from 'prop-types'
import StepContent from '@material-ui/core/StepContent'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

import { About, Contact, Emergency, Avatar, Terms } from './steps'
import ConditionalWrap from './conditional-wrap'

const useStyles = makeStyles((theme) => ({
  stepHeader: {
    marginBottom: theme.spacing(2),
  },
  registerBody: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(5),
  },
}))
const stepComponents = [About, Contact, Emergency, Avatar, Terms]

const StepBody = ({ isMobile, ...props }) => {
  const classes = useStyles()
  const { stepHeadings, activeStep, activeModel } = useContext(RegisterContext)
  if (activeStep >= 0 && activeStep < stepComponents.length) {
    const StepForm = stepComponents[activeStep]

    return (
      <ConditionalWrap
        condition={isMobile}
        wrapTrue={(children) => <StepContent {...props}>{children}</StepContent>}
        wrapFalse={(children) => (
          <Paper variant="outlined" className={classes.registerBody} square>
            {children}
          </Paper>
        )}
      >
        <Typography
          variant={isMobile ? 'h4' : 'h2'}
          className={classes.stepHeader}
          component="h2"
          align="center"
          color="textSecondary"
        >
          {stepHeadings[activeStep]}
        </Typography>
        <StepForm initialData={activeModel} />
      </ConditionalWrap>
    )
  }
  return null
}

StepBody.propTypes = {
  isMobile: PropTypes.bool,
}

export default StepBody
