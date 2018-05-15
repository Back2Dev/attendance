import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from "react-jsonschema-form-semanticui";

const MemberAdd = (props) => {

  const schema = {
    title: "Volunteering Registration Form",
    type: "object",
    // required: ["title"],
    properties: {
      "Your Details": {
        type: "object",
        properties: {
          firstname: { type: "string", title: "First name" },
          lastname: { type: "string", title: "Last name" },
          address: { type: "string", title: "Street Address" },
          suburb: { type: "string", title: "Suburb" },
          state: { type: "string", title: "State" },
          postcode: { type: "string", title: "Postcode" },
          phone: { type: "string", title: "Phone number" },
          mobile: { type: "string", title: "Mobile number" },
        }
      },
      "Emergency Contact": {
        type: "object",
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
      },
      "Other Information": {
        type: "object",
        properties: {
          bikesHousehold: { type: "string", title: "How many bikes in your household?", enum: ["one", "two", "three"] },
          primaryBike: { type: "string", title: "Primary bike", enum: ["one", "two", "three"]  },
          workStatus: { type: "string", title: "Work status", enum: ["one", "two", "three"]  },
          reasons: {type: "string", title: "Reasons for volunteering"}
        }
      }
    }
  }

  const uiSchema = {
    "Volunteer Details": {
      firstname: {
        "ui:placeholder": "Enter your first name"
      },
      lastname: {
        "ui:placeholder": "Enter your last name"
      }
    },
    "Other Information":{
      bikesHousehold: {
        "ui:widget": "select"
      },
      primaryBike: {
        "ui:widget": "select"
      },
      workStatus: {
        "ui:widget": "select"
      },
      reasons: {
        "ui:widget": "textarea"
      }
    }
  }

  const log = (type) => console.log.bind(console, type)

  return (
    <section id="volunteer-signup-form">
      <Form
        schema={schema}
        uiSchema={uiSchema}
        onChange={log("changed")}
        onSubmit={log("submitted")}
        onError={log("errors")} />
    </section>
  );
}

MemberAdd.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default MemberAdd