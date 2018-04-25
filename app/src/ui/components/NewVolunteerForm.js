import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

class NewVolunteerForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section id="volunteer-signup-form">
          <h1>New Volunteer Signup Form</h1>
          <h2>Your Details</h2>
          <form onSubmit={this.handleSubmit} className="commentForm">
            <input type="text" id="pplName" placeholder="First name" />
            <input type="text" id="pplSurname" placeholder="Surname" />
            <input type="text" placeholder="Your email" />
            <input type="text" placeholder="Address" />
            <input type="text" placeholder="Suburb" />
            <input type="text" placeholder="State" />
            <input type="text" placeholder="Postcode" />
            <input type="text" placeholder="Phone" />
            <input type="text" placeholder="Mobile" />
            <h2>Emergency Contact</h2>
            <input type="text" placeholder="Name" />
            <input type="text" placeholder="Email" />
            <input type="text" placeholder="Address" />
            <input type="text" placeholder="Suburb" />
            <input type="text" placeholder="State" />
            <input type="text" placeholder="Postcode" />
            <input type="text" placeholder="Phone" />
            <input type="text" placeholder="Mobile" />
            <h2>Other Information</h2>
            <input type="text" placeholder="How many bikes in your household?" />
            <input type="radio" name="primary-bike" value="Road/racer" checked /> Road/racer
            <input type="radio" name="primary-bike" value="Hybrid" /> Hybrid
            <input type="radio" name="primary-bike" value="Mountain Bike" /> Mountain Bike
            <div className={"submit-cancel"} >
            <input className={"ui button"} type="submit" value="Submit" />
            <div className={"a-wrap"}><Link className={"ui button"} to="/">Cancel</Link></div>
            </div>
          </form>
      </section>
    );
  }
}
export default NewVolunteerForm;
