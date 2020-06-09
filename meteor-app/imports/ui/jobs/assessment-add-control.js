import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'semantic-ui-react'

const AssessmentAddControl = (props) => {
  return (
    <div style={{marginTop: "50px"}}>
      {
        (props.step >= 1) &&
        <Button type="button" floated="left" onClick={props.backStep}>
          <Icon name="arrow left" />
          Back
        </Button>
      }
      {
        (props.step < props.totalSteps - 1) &&
        <Button type="submit" floated="right" onClick={props.forwardStep} >
          Next
          <Icon name="arrow right" />
        </Button>
      }
      {
        (props.step === props.totalSteps - 1) &&
        <Button onClick={props.onSubmit} floated="right" positive>
          Submit
        </Button>
      }
    </div>
  )
}

AssessmentAddControl.propTypes = {
  step: PropTypes.number.isRequired,
  backStep: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  totalSteps: PropTypes.number.isRequired,
}

export default AssessmentAddControl