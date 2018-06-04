import React from 'react'
import PropTypes from 'prop-types';
import { Header, Input } from 'semantic-ui-react'


const MemberVisitPin = (props) => {
  return (
    <div>
      <Header>
        Enter your PIN
    </Header>
      <input type="password" pattern="[0-9]*" inputMode="numeric"
        style={{width: '100px'}}
        onChange={props.onPinInput}
      />
    </div>
  )
}

MemberVisitPin.propTypes = {
  onPinInput: PropTypes.func.isRequired,
};

export default MemberVisitPin