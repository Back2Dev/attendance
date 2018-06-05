import React from 'react'
import PropTypes from 'prop-types';
import { Button, Header, Input } from 'semantic-ui-react'
import '/imports/ui/member/member-visit-pin.css'

const MemberVisitPin = (props) => {
  return (
    <div className='member-visit-pin'>
    <Input
      autoFocus
      maxLength='4'
      placeholder='Enter your pin'
      type="tel"
      pattern="/[0-9]/"
      inputMode="numeric"
      style={{ width: '100%' }}
      onChange={props.onPinInput}
      value={props.pin}
    />
  </div>
  )
}



MemberVisitPin.propTypes = {
  onPinInput: PropTypes.func.isRequired,
  pin: PropTypes.string,
};

export default MemberVisitPin