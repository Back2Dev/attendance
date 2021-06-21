import React, { useRef } from 'react'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import PropTypes from 'prop-types'

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
    custom: function () {
      if (!/\d{4}/.test(this.value)) {
        return 'badPin'
      }
    },
    uniforms: {
      label: 'PIN number (4 digits) for signing in and out',
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
    },
  },
})

ContactSchema.messageBox.messages({
  en: {
    badPin: 'PIN must be 4 digits only',
    pinMismatch: 'PINs do not match',
  },
})

const schema = new SimpleSchema2Bridge(ContactSchema)

const Contact = ({ initialData }) => {
  const formRef = useRef()
  return (
    <AutoForm schema={schema} ref={formRef} model={initialData} placeholder>
      {Object.keys(ContactSchema.schema()).map((name, idx) => {
        const inputProps = ['pin', 'pinConfirm'].includes(name) ? { maxLength: 4 } : {}
        return (
          <div key={idx}>
            <AutoField name={name} inputProps={inputProps} />
            <ErrorField name={name} />
          </div>
        )
      })}
      <StepButtons formRef={formRef} />
    </AutoForm>
  )
}

Contact.propTypes = {
  initialData: PropTypes.object,
}

Contact.defaultProps = {
  initialData: {},
}

export default Contact
