import React, { Component } from 'react';
import Form from "react-jsonschema-form-semanticui";
import Control from '/imports/ui/member/member-add-control'

const schema = {
  title: "Details",
  type: "object",
  required: ["name"],
  properties: {
    name: { type: "string", title: "Name" },
    email: { type: "string", format: "email", title: "Email" },
    address: { type: "string", title: "Street Address" },
    suburb: { type: "string", title: "Suburb" },
    state: { type: "string", title: "State", default: "VIC", enum: ["VIC", "NSW", "SA", "QLD", "NT", "WA", "TAS"] },
    postcode: { type: "number", title: "Postcode" },
    phone: { type: "string", title: "Phone number" },
    mobile: { type: "string", title: "Mobile number" },
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
}

const Details = (props) => {
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={props.onSubmit}
      formData={props.formData}
    >
    <Control backStep={props.backStep} step={props.step}/>
    </Form>
  );
}

export default Details