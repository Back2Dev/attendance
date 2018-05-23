import React from 'react'
import PropTypes from 'prop-types';
import { Step } from 'semantic-ui-react'

const MemberAddSteps = (props) => {
  return (
    <Step.Group ordered>
      <Step completed={(props.step > 1)}>
        <Step.Content>
          <Step.Title>Why would you like to join us?</Step.Title>
          <Step.Description>Tell us a bit more about yourself</Step.Description>
        </Step.Content>
      </Step>
      <Step completed={(props.step > 2)}>
        <Step.Content>
          <Step.Title>Emergency Contact</Step.Title>
          <Step.Description>Just in case</Step.Description>
        </Step.Content>
      </Step>
      <Step completed={(props.step > 3)}>
        <Step.Content>
          <Step.Title>Your Details</Step.Title>
          <Step.Description>Contact Details</Step.Description>
        </Step.Content>
      </Step>
    </Step.Group>
  )
}

MemberAddSteps.propTypes = {
  step: PropTypes.number.isRequired,
};

export default MemberAddSteps