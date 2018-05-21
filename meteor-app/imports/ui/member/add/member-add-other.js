import React, { Component } from 'react';
import Form from "react-jsonschema-form-semanticui";
import Control from './member-add-control'

const schema = {
  type: "object",
  title: "Lets get to know each other.",
  properties: {
    bikesHousehold: { type: "number", title: "How many bikes in your household?" },
    primaryBike: { type: "string", title: "What type of bike do you ride the most?", enum: ["Road/racer", "Hybrid", "Mountain", "Cruiser", "Ladies", "Gents", "Fixie/Single Speed"] },
    workStatus: { type: "string", title: "Work status", enum: ["Full Time", "Part Time", "Pension/Disability", "Unemployed", "Student", "Retired"] },
    reasons: { type: "string", title: "Reasons for volunteering" }
  }
}


function validate(formData, errors) {
  console.log('validating...')
  // if (formData.bikesHousehold !== 5) {
  //   errors.bikesHousehold.addError("You need at least 5 bikes!");
  // }
  return errors;
}

const uiSchema = {
  bikesHousehold: {
    "ui:widget": "updown",
    "ui:placeholder": "Enter the number of bikes you own",
  },
  primaryBike: {
    "ui:widget": "select",
    "ui:placeholder": "Select a type of bike",
  },
  workStatus: {
    "ui:widget": "select",
    "ui:placeholder": "Select your employment status",
  },
  reasons: {
    "ui:widget": "textarea",
    "ui:placeholder": "Some good starting points:\nWhat makes you want to to volunteer at Back2Bikes?\nHave you ever done any other volunteering before?\nHave you worked on bikes or something similar before?",
    "ui:options": {
      "rows": 12
    }

  }
}

const Other = (props) => {
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={props.onSubmit}
      validate={validate}
      formData={props.formData}
    >
    <Control backStep={props.backStep} step={props.step}/>

    </Form>
  );
}

export default Other