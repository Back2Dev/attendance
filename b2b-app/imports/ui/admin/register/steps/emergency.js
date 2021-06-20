import React, { useRef } from 'react'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import StepButtons from './step-buttons'

const EmergencySchema = new SimpleSchema({
  emergencyContact: {
    type: String,
    uniforms: {
      label: 'Emergency Contact Name',
    },
  },
  emergencyEmail: {
    type: String,
    optional: true,
    uniforms: {
      label: 'Emergency Contact Email',
    },
  },
  emergencyPhone: {
    type: String,
    uniforms: {
      label: 'Emergency Contact Mobile Number',
    },
  },
})

const schema = new SimpleSchema2Bridge(EmergencySchema)

const Emergency = ({ initialData }) => {
  const formRef = useRef()
  return (
    <div>
      <h1>Emergency form</h1>
      <AutoForm schema={schema} placeholder ref={formRef} model={initialData}>
        {Object.keys(EmergencySchema.schema()).map((name, idx) => (
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

export default Emergency
