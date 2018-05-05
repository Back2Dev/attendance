// add-volunteer.js
import React, { Component } from "react";
import { render } from "react-dom";

import Form from "react-jsonschema-form-semanticui-semanticui"

const schema = {
  title: "Volunteer registration",
  type: "object",
  required: ["name","email"],
  properties: {
    name: {type: "string", title: "Name"},
    email: {type: "string", format: "email", title: "Email"},
    password: {type: "string", "ui:help": "Hint: Make it strong!", "ui:placeholder": "secret"}
  }
};

const log = (type) => console.log.bind(console, type);

class NewVolunteer extends React.Component {
  constructor(props, context) {
    super(props);
    // this.handleSubmit=this.handleSubmit.bind(this);
  }

	render() {
		return (
		  <Form schema={schema}
		        onChange={log("changed")}
		        onSubmit={log("submitted")}
		        onError={log("errors")} />
    )
	}

	// NewVolunteer.propTypes = {}
  // onSubmit: PropTypes.func.isRequired
};

export default NewVolunteer;
