import React, { useRef } from 'react'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, ErrorField, LongTextField } from 'uniforms-material'
import StepButtons from './step-buttons'

const AboutFormSchema = new SimpleSchema(
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

const schema = new SimpleSchema2Bridge(AboutFormSchema)

const About = ({ initialData }) => {
  const formRef = useRef()
  return (
    <div>
      <h1>About form</h1>
      <AutoForm
        schema={schema}
        onSubmit={console.log}
        placeholder
        ref={formRef}
        model={initialData}
      >
        {Object.keys(AboutFormSchema.schema()).map((name, idx) => (
          <div key={idx}>
            <AutoField name={name} />
            <ErrorField name={name} />
          </div>
        ))}
        <StepButtons formRef={formRef} />
      </AutoForm>
    </div>
  )
}

export default About
