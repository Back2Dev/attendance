import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form } from 'semantic-ui-react';

class AddVolunteer extends Component {

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("handleSubmit method");
    this.props.onSubmit({
      firstname: this.firstname.value,
      surname: this.surname.value,
      pplPhone: this.pplPhone.value,
      pplEmail: this.pplEmail.value,
      avatar: Math.floor((Math.random() * 10) + 1) + '.jpg',
    });
  }

  render() {
    return (
      <section id="volunteer-signup-form">
        <h1>New Volunteer Signup Form</h1>
        <h2>Your Details</h2>
        <Form>
          <Form.Input
            ref={c => (this.firstname = c)}
            type="text"
            id="firstname"
            placeholder="First name"
          />
          <input
            ref={c => (this.surname = c)}
            type="text" id="surname"
            placeholder="Surname" />
          <input
            ref={c => (this.phone = c)}
            type="text" id="phone"
            placeholder="Phone"
          />
          <input
            ref={c => (this.email = c)}
            type="text" id="email"
            placeholder="Email" />
          <div className={"submit-cancel"}>
            <input
              className={"ui button"}
              type="submit" value="Submit" />
            <div className={"a-wrap"}>
              <Link className={"ui button"} to="/">
                Cancel
              </Link>
            </div>
          </div>
        </Form>
      </section>
    );
  }
}

AddVolunteer.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default AddVolunteer;
