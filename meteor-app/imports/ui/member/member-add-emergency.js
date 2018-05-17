import React, { Component } from 'react';
import Form from "react-jsonschema-form-semanticui";

const schema = {
  type: "object",
  title: "Who should we contact in an emergency?",
  properties: {
    firstname: { type: "string", title: "First name" },
    lastname: { type: "string", title: "Last name" },
    address: { type: "string", title: "Street Address" },
    suburb: { type: "string", title: "Suburb" },
    state: { type: "string", title: "State" },
    postcode: { type: "string", title: "Postcode" },
    phone: { type: "string", title: "Phone number" },
    mobile: { type: "string", title: "Mobile number" },
  },
}

const uiSchema = {
  firstname: {
    "ui:placeholder": "Enter your first name",
  },
  lastname: {
    "ui:placeholder": "Enter your last name"
  },
  phone: {
    "ui:options": {
      inputType: 'tel'
    }
  },
  mobile: {
    "ui:options": {
      inputType: 'tel'
    }
  },

}

class Emergency extends Component {
  render() {
    return (
      <Form
        schema={schema}
        uiSchema={uiSchema}
      >
        <div></div>
      </Form>
    );
  }
}

export default Emergency;
// onChange={log("changed")}
// onSubmit={props.onSubmit}
// onError={log("errors")}
// 