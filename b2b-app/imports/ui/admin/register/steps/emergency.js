import React, { useRef } from 'react'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import StepButtons from './step-buttons'

const EmergencySchema = new SimpleSchema({
  emergencyContact: {
    type: String,
    uniforms: {
      label: 'Emergency contact name',
    },
  },
  emergencyEmail: {
    type: String,
    optional: true,
    uniforms: {
      label: 'Emergency contact email',
    },
  },
  emergencyPhone: {
    type: String,
    uniforms: {
      label: 'Emergency contact number',
    },
  },
})

const schema = new SimpleSchema2Bridge(EmergencySchema)

const useStyles = makeStyles({
  root: {
    gridTemplateCollumns: '1fr 1fr',
    gridTemplateAreas: `'emergencyContact emergencyPhone'
      'emergencyEmail emergencyEmail'
      'stepButtons stepButtons'
    `,
  },
})

const Emergency = ({ initialData }) => {
  const classes = useStyles()
  const formRef = useRef()
  return (
    <AutoForm
      schema={schema}
      placeholder
      ref={formRef}
      model={initialData}
      className={classes.root}
    >
      {Object.keys(EmergencySchema.schema()).map((name, idx) => (
        <div key={idx} style={{ gridArea: name }}>
          <AutoField name={name} />
          <ErrorField name={name} />
        </div>
      ))}
      <StepButtons formRef={formRef} />
    </AutoForm>
  )
}

Emergency.propTypes = {
  initialData: PropTypes.object,
}

Emergency.defaultProps = {
  initialData: {},
}

export default Emergency
