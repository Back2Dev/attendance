import React, { useRef } from 'react'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import StepButtons from './step-buttons'

const ContactSchema = new SimpleSchema({
  name: String,
  email: String,
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
      label: 'PIN number',
      helperText: 'Must be 4 digits. This will be used for signing in and out.',
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
      label: 'Confirm PIN',
    },
  },
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
})

ContactSchema.messageBox.messages({
  en: {
    badPin: 'PIN must be 4 digits only',
    pinMismatch: 'PINs do not match',
  },
})

const schema = new SimpleSchema2Bridge(ContactSchema)

const useStyles = makeStyles({
  root: {
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateAreas: `'name name name name'
      'email email email email'
      'phone phone phone phone'
      'mobile mobile mobile mobile'
      'pin pin pinConfirm pinConfirm'
      'addressStreet addressStreet addressStreet addressStreet'
      'addressSuburb addressSuburb addressState addressPostcode'
      'stepButtons stepButtons stepButtons stepButtons'
    `,
  },
})

const Contact = ({ initialData }) => {
  const classes = useStyles()
  const formRef = useRef()
  return (
    <AutoForm
      schema={schema}
      ref={formRef}
      model={initialData}
      placeholder
      className={classes.root}
    >
      {Object.keys(ContactSchema.schema()).map((name, idx) => {
        const inputProps = ['pin', 'pinConfirm'].includes(name) ? { maxLength: 4 } : {}
        return (
          <div key={idx} style={{ gridArea: name }}>
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
