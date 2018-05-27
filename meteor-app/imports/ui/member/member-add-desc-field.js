import React from 'react'
import PropTypes from 'prop-types';
import { Image, Segment } from 'semantic-ui-react'

const CustomDescriptionField = ({id, description}) => {
  return <div id={id}>Description:</div>;
};

CustomDescriptionField.defaultProps = {
  // value: 'default.jpg'
};

CustomDescriptionField.propTypes = {
  // options: PropTypes.object.isRequired,
};

export default CustomDescriptionField
