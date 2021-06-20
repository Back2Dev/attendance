import React, { useRef } from 'react'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import StepButtons from './step-buttons'

const TermsSchema = new SimpleSchema({
  privacy: {
    type: Boolean,
    uniforms: {
      label:
        'I consent to Back2bikes storing the information I have provided above. I understand that Back2bikes will not disclose the above information without my express consent other than for reasons related to my engagement as a volunteer.',
    },
  },
})

const schema = new SimpleSchema2Bridge(TermsSchema)

const Terms = ({ initialData }) => {
  const formRef = useRef()
  return (
    <div>
      <h1>Terms form</h1>
      <AutoForm
        schema={schema}
        onSubmit={console.log}
        placeholder
        ref={formRef}
        model={initialData}
      >
        {Object.keys(TermsSchema.schema()).map((name, idx) => (
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

export default Terms
