import React, { useRef, useContext } from 'react'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import StepButtons from './step-buttons'
import {
  aboutBridge,
  contactBridge,
  emergencyBridge,
  avatarBridge,
  termsBridge,
} from '../form-bridge'
import { RegisterContext } from './context'
import StepDataList from './step-data-list'

const useStyles = makeStyles((theme) => ({
  root: {
    gridTemplateColumns: '1fr',
    gridTemplateAreas: `'terms'
      'privacy'
      'stepButtons'`,
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  termsHeader: {
    marginBottom: theme.spacing(2),
  },
}))
const schemas = [aboutBridge, contactBridge, emergencyBridge, avatarBridge].map(
  (bridge) => bridge.schema
)

const Terms = ({ initialData }) => {
  const formRef = useRef()
  const classes = useStyles()
  const { models, steps, dispatch } = useContext(RegisterContext)
  const stepDataModels = schemas.map((schema, stepNum) =>
    Object.keys(schema.schema()).reduce((model, field) => {
      const label = schemas[stepNum].label(field)
      if (['pin', 'pinConfirm'].includes(field)) {
        model[label] = 'MASKED'
      } else {
        model[label] =
          models[stepNum][field] !== undefined ? models[stepNum][field] : null
      }
      return model
    }, {})
  )

  return (
    <AutoForm
      schema={termsBridge}
      placeholder
      ref={formRef}
      model={initialData}
      style={{ display: 'block' }}
    >
      {stepDataModels.map((model, stepNum) => (
        <StepDataList
          key={stepNum}
          title={steps[stepNum]}
          onEdit={() => dispatch({ type: 'go_edit_step', step: stepNum })}
          model={model}
        />
      ))}
      <Typography variant="h3" className={classes.termsHeader}>
        Terms
      </Typography>
      <Typography>
        I consent to Back2bikes storing the information I have provided above. I
        understand that Back2bikes will not disclose the above information without my
        express consent other than for reasons related to my engagement as a volunteer.
      </Typography>
      {Object.keys(termsBridge.schema.schema()).map((name, idx) => (
        <div key={idx} style={{ gridArea: name }}>
          <AutoField name={name} />
          <ErrorField name={name} />
        </div>
      ))}
      <StepButtons formRef={formRef} />
    </AutoForm>
  )
}

Terms.propTypes = {
  initialData: PropTypes.object,
}

Terms.defaultProps = {
  initialData: {},
}

export default Terms
