import React from 'react'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, ErrorField, LongTextField } from 'uniforms-material'
import StepButtons from './step-buttons'

const ContactFormSchema = new SimpleSchema(
  {
    bikesHousehold: {
      type: SimpleSchema.Integer,
      uniforms: { label: 'Enter the number of bikes you own' },
    },
    primaryBike: {
      type: String,
      uniforms: {
        label: 'Select a type of bike',
      },
      required: true,
      allowedValues: [
        'Road/racer',
        'Hybrid',
        'Mountain',
        'Cruiser',
        'Ladies',
        'Gents',
        'Fixie/Single Speed',
      ],
    },
    workStatus: {
      type: String,
      label: 'Select your employment status',
      required: true,
      allowedValues: [
        'Full Time',
        'Part Time',
        'Pension/Disability',
        'Unemployed',
        'Student',
        'Retired',
      ],
    },
    reasons: {
      type: String,
      uniforms: {
        label:
          'What makes you want to to volunteer at Back2Bikes?\nHave you ever done any other volunteering before?\nHave you worked on bikes or something similar before?',
        component: LongTextField,
        rows: 6,
      },
    },
  },
  { requiredByDefault: false }
)

const schema = new SimpleSchema2Bridge(ContactFormSchema)

const Contact = () => {
  return (
    <div>
      <h1>Contact form</h1>
      <AutoForm schema={schema} onSubmit={console.log} placeholder>
        {Object.keys(ContactFormSchema.schema()).map((name, idx) => (
          <div key={idx}>
            <AutoField name={name} />
            <ErrorField name={name} />
          </div>
        ))}
        <StepButtons />
      </AutoForm>
    </div>
  )
}

export default Contact
