import React, { Component } from 'react';
import Form from "react-jsonschema-form-semanticui";

const schema = {
  type: "object",
  title: "Who should we contact in an emergency?",
  properties: {
    emergencyContact: { type: "string", title: "First name" },
    emergencyEmail: { type: "string", title: "Email" },
    emergencyPhone: { type: "string", title: "Phone number" },
    emergencyMobile: { type: "string", title: "Mobile number" },
  },
}

const uiSchema = {
  emergencyContact: {
    "ui:placeholder": "Enter your emergency contacts name",
  },
  emergencyEmail: {
    "ui:placeholder": "Enter your emergency contacts email"
  },
  emergencyPhone: {
    "ui:placeholder": "Enter your emergency contacts phone number",
    "ui:options": {
      inputType: 'tel'
    }
  },
  emergencyMobile: {
    "ui:placeholder": "Enter your emergency contacts mobile phone number",
    "ui:options": {
      inputType: 'tel'
    }
  },

}

const Emergency = (props) => {
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={props.onSubmit}
      formData={props.formData}
    />
  );
}

export default Emergency;