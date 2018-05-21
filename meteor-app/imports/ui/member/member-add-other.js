import React, { Component } from 'react';
import Form from "react-jsonschema-form-semanticui";

const schema = {
  type: "object",
  title: "Tell us a bit more about yourself",
  properties: {
    bikesHousehold: { type: "number", title: "How many bikes in your household?" },
    primaryBike: { type: "string", title: "What type of bike do you ride the most?", enum: ["Road/racer", "Hybrid", "Mountain", "Cruiser", "Ladies", "Gents", "Fixie/Single Speed"] },
    workStatus: { type: "string", title: "Work status", enum: ["Full Time", "Part Time", "Pension/Disability", "Unemployed", "Student", "Retired"] },
    reasons: { type: "string", title: "Reasons for volunteering" }
  }
}

const uiSchema = {
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
    "ui:widget": "textarea",
    "ui:placeholder": "Tell us a bit about why you want to volunteer at Back 2 Bikes"

  }
}

class Other extends Component {
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

export default Other;