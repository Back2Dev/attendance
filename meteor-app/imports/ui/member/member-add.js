import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from "react-jsonschema-form-semanticui";
import { Grid, Container } from 'semantic-ui-react'

const MemberAdd = (props) => {

  const schema = {
    title: "Volunteering Registration Form",
    type: "object",
    // required: ["title"],
    properties: {
      "details": {
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
      "emergency": {
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
      "other": {
        type: "object",
        properties: {
          bikesHousehold: { type: "number", title: "How many bikes in your household?" },
          primaryBike: { type: "string", title: "Primary bike", enum: ["Road/racer", "Hybrid", "Mountain", "Cruiser", "Ladies", "Gents", "Fixie/Single Speed"] },
          workStatus: { type: "string", title: "Work status", enum: ["Full Time", "Part Time", "Pension/Disability", "Unemployed", "Student", "Retired"] },
          reasons: { type: "string", title: "Reasons for volunteering" }
        }
      }
    }
  }

  const uiSchema = {
    "details": {
      firstname: {
        "ui:placeholder": "Enter your first name"
      },
      lastname: {
        "ui:placeholder": "Enter your last name"
      }
    },
    "other": {
      bikesHousehold: {
        "ui:widget": "updown"
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
    <div className='registration-form'>
      <Grid
        textAlign='center'
        style={{ height: '100%' }}
        verticalAlign='middle'
      >
        <Grid.Column style={{ maxWidth: '450px' }}>
          <Form
            schema={schema}
            uiSchema={uiSchema}
            onChange={log("changed")}
            onSubmit={log("submitted")}
            onError={log("errors")}
          >
            <div>
              <button onClick={props.onSubmit} type="submit">Submit</button>
              <button type="button">Cancel</button>
            </div>
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  );
}

MemberAdd.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default MemberAdd