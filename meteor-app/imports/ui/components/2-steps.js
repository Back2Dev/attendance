import React, { Component } from "react"
import { render } from "react-dom"

import Form from "react-jsonschema-form-semanticui-semanticui"

const step1schema = {
  title: "Step 1",
  type: "object",
  required: ["name"],
  properties: {
  	name: {type: "string", minLength: 3, title: "My name is"},
    email: {type: "string", format: "email", title: "and my email is"},
    location: {
      type: "string", 
      title: "working in",
      "anyOf": [
        {
          "type": "string",
          "enum": [
            "NY"
          ],
          "title": "New York"
        },
        {
          "type": "string",
          "enum": [
            "UK - London"
          ],
          "title": "London"
        },
        {
          "type": "string",
          "enum": [
            "UK - Brum"
          ],
          "title": "Birmingham"
        }
      ],

    },
    duration: {
      type: "string", 
      title: "I've been working in the industry for",
      placeHolder: "choose studio",
      "anyOf": [
        {"type": "string","enum": ["1-3"],"title": "1-3 years"},
        {"type": "string","enum": ["3-5"],"title": "3-5 years"},
        {"type": "string","enum": ["5+"],"title": "5+ years"},
      ],
    },
    gender: {
      type: "string",
      title: "I am a",
      placeHolder: "choose gender",
    }
  }
}
const step1ui = {
  location: {
   "ui:placeholder": "eg London"
  }
}

const step2schema = {
  title: "Step 2",
  type: "object",
  required: ["age"],
  properties: {
    age: {type: "integer"}
  }
}
const step2ui = {
  
}

const step3schema = {
  title: "Last step",
  type: "object",
  required: ["interests"],
  properties: {
    interests: {type: "string"}
  }
}
const step3ui = {
  
}

const steps = [
  { schema: step1schema, ui: step1ui },
  { schema: step2schema, ui: step2ui },
  { schema: step3schema, ui: step3ui },
]

class Steps extends React.Component {
  constructor(props) {
    super(props)
    this.state = {step: 1, formData: {}}
    this.goBack=this.goBack.bind(this);
  }
  
  goBack({formData}) {
    if (this.state.step > 1) {
      this.setState({step: this.state.step - 1})
      // ,
      //   formData: {
      //     ...this.state.formData, 
      //     ...formData
      //   }, 
      // })
    }
  }

  onSubmit = ({formData}) => {
  	if (this.state.step < steps.length) {
      this.setState({
        step: this.state.step + 1,
        formData: {
          ...this.state.formData, 
          ...formData
        }, 
      })
    } else {
      alert("You submitted " + JSON.stringify(formData, null, 2))
    }
  }
  
  render() {
    return (
      <Form 
        schema={steps[this.state.step-1].schema}
        uiSchema={steps[this.state.step-1].ui}
        onSubmit={this.onSubmit}
        formData={this.state.formData}>
        <div>
          <button type="button" onClick={this.goBack}>Back</button>
          <button type="submit">Submit</button>
        </div>
      </Form>
    )
  }
}

export default Steps