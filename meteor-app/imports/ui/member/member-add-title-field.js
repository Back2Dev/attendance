import React from 'react'
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react'

const CustomTitleField = (props) => {
  return (
    <Header as='h1' textAlign='center' divided >{props.title}</Header>
  );
}

CustomTitleField.propTypes = {
  title: PropTypes.string.isRequired,
};

export default CustomTitleField
