import React from 'react'
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react'

const MemberAddControl = (props) => {
  return (
    <div>
      {
        (props.step > 1) &&
        <Button type='button' floated='left' onClick={props.backStep}>
          <Icon name='arrow left' />
          Back
        </Button>
      }
      {
        (props.step < 3) &&
        <Button type='submit' floated='right' >
          Next
        <Icon name='arrow right' />
        </Button>
      }
      {
        (props.step == 3) &&
        <Button type='submit' floated='right' positive>
          Submit
          </Button>
      }
    </div>
  )
}

MemberAddControl.propTypes = {
  step: PropTypes.number.isRequired,
  backStep: PropTypes.func.isRequired,
};

export default MemberAddControl