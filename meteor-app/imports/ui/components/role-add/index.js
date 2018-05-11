import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form } from 'semantic-ui-react';

const RoleAdd = (props) => {
  return (
    <section id="volunteer-signup-form">
      <h1>New Volunteer Signup Form</h1>
      <h2>Your Details</h2>
    </section>
  );
}

RoleAdd.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default RoleAdd