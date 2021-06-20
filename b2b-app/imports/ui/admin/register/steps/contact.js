import React, { useRef } from 'react'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import StepButtons from './step-buttons'

const ContactSchema = new SimpleSchema({
  name: String,
  email: String,
  addressStreet: {
    type: String,
    optional: true,
    uniforms: {
      label: 'Address',
    },
  },
  addressSuburb: {
    type: String,
    optional: true,
    uniforms: {
      label: 'Suburb',
    },
  },
  addressState: {
    type: String,
    allowedValues: ['VIC', 'NSW', 'SA', 'QLD', 'NT', 'WA', 'TAS'],
    optional: true,
    uniforms: {
      label: 'State',
    },
  },
  addressPostcode: {
    type: String,
    optional: true,
    uniforms: {
      label: 'Postcode',
    },
  },
  phone: {
    type: String,
    optional: true,
    uniforms: {
      label: 'Phone number',
    },
  },
  mobile: {
    type: String,
    uniforms: {
      label: 'Mobile number',
    },
  },
  pin: {
    type: String,
    min: 4,
    max: 4,
    custom: function () {
      if (!/\d+/.test(this.value)) {
        return 'badPin'
      }
    },
    uniforms: {
      label: 'PIN number (4 digits) for signing in and out',
      inputProps: { maxLength: 4 },
    },
  },
  pinConfirm: {
    type: String,
    custom: function () {
      if (this.field('pin').value !== this.value) {
        return 'pinMismatch'
      }
    },
    uniforms: {
      label: 'Confirm PIN number',
      inputProps: { maxLength: 4 },
    },
  },
})

ContactSchema.messageBox.messages({
  en: {
    badPin: 'PIN must be digits only',
    pinMismatch: 'PINs do not match',
  },
})

const schema = new SimpleSchema2Bridge(ContactSchema)

const Contact = ({ initialData }) => {
  const formRef = useRef()
  return (
    <div>
      <h1>Contact</h1>
      <AutoForm schema={schema} ref={formRef} model={initialData} placeholder>
        {Object.keys(ContactSchema.schema()).map((name, idx) => (
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

export default Contact
