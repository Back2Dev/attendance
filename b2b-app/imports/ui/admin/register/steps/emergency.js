import React, { useRef } from 'react'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import StepButtons from './step-buttons'
import { emergencyBridge } from '../form-bridge'

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
      schema={emergencyBridge}
      placeholder
      ref={formRef}
      model={initialData}
      className={classes.root}
    >
      {Object.keys(emergencyBridge.schema.schema()).map((name, idx) => (
        <div key={idx} style={{ gridArea: name }}>
          <AutoField name={name} autoFocus={idx === 0} />
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
