import React from 'react'
import PropTypes from 'prop-types';
import { Step } from 'semantic-ui-react'

const MemberAddSteps = (props) => {

  return (
    <Step.Group ordered>
      {props.steps.map((step, i) =>
        <Step completed={(props.step >= i)}>
          <Step.Content>
            <Step.Title>{step.title}</Step.Title>
            <Step.Description>{step.description}</Step.Description>
          </Step.Content>
        </Step>
      )}
    </Step.Group>
  )
}

MemberAddSteps.propTypes = {
  step: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired,
};

export default MemberAddSteps