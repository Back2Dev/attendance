import React from 'react'
import PropTypes from 'prop-types';

const MemberVisitPin = (props) => {
  return (
    <input
      type="text"
      onChange={props.onPinChange}
    />
  )
}

MemberVisitPin.propTypes = {
  onPinChange: PropTypes.func.isRequired,
};

export default MemberVisitPin