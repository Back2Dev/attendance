import React, { Component } from 'react';
import Form from "react-jsonschema-form-semanticui";

const schema = {
  title: "Details",
  type: "object",
  required: ["firstname"],
  properties: {
    firstname: { type: "string", title: "First name" },
    lastname: { type: "string", title: "Last name" },
    email: { type: "string", format: "email", title: "Email" },
    address: { type: "string", title: "Street Address" },
    suburb: { type: "string", title: "Suburb" },
    state: { type: "string", title: "State", default: "VIC", enum: ["VIC", "NSW", "SA", "QLD", "NT", "WA", "TAS"] },
    postcode: { type: "number", title: "Postcode" },
    phone: { type: "string", title: "Phone number" },
    mobile: { type: "string", title: "Mobile number" },
    pref_contact: {
      type: "array", title: "Preferred method of contact",
      items: [
        {
          title: "Mobile",
          type: "boolean",
          default: false
        },
        {
          title: "Landline",
          type: "boolean",
          default: false
        },
        {
          title: "Email",
          type: "boolean",
          default: false
        }


      ]
    },
  }
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
  pref_contact: {
    "ui:widget": "checkboxes",
    "ui:options": {
      inline: true
    }
  }
}

class Details extends Component {
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

export default Details