import React, { useRef } from 'react'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import StepButtons from './step-buttons'
import { contactSchema } from '../form-schema'

const useStyles = makeStyles({
  root: {
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridTemplateAreas: `'name name name name'
      'email email email email'
      'mobile mobile phone phone'
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
      schema={contactSchema}
      ref={formRef}
      model={initialData}
      placeholder
      className={classes.root}
    >
      {Object.keys(contactSchema.schema.schema()).map((name, idx) => {
        const inputProps = ['pin', 'pinConfirm'].includes(name) ? { maxLength: 4 } : {}
        return (
          <div key={idx} style={{ gridArea: name }}>
            <AutoField name={name} inputProps={inputProps} autoFocus={idx === 0} />
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
