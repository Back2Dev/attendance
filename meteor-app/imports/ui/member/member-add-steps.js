import React from 'react'
import PropTypes from 'prop-types';
import { Step } from 'semantic-ui-react'

const MemberAddSteps = (props) => {

  return (
    <Step.Group ordered fluid unstackable>
      {props.steps.map((step, i) =>
        <Step key={i} completed={(props.progress >= i)} onClick={() => props.goToStep(i)}>
          <Step.Content>
            <Step.Title>{step.stepTitle}</Step.Title>
            <Step.Description>{step.stepDescription}</Step.Description>
          </Step.Content>
        </Step>
      )}
    </Step.Group>
  )
}

MemberAddSteps.propTypes = {
  step: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
  goToStep: PropTypes.func.isRequired,
};

export default MemberAddSteps