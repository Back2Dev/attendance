import React, { useRef } from 'react'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import StepButtons from './step-buttons'

const TermsSchema = new SimpleSchema({
  privacy: {
    type: Boolean,
    uniforms: {
      label: 'I accept the terms',
      helperText:
        'I consent to Back2bikes storing the information I have provided above. I understand that Back2bikes will not disclose the above information without my express consent other than for reasons related to my engagement as a volunteer.',
    },
  },
})

const schema = new SimpleSchema2Bridge(TermsSchema)

const useStyles = makeStyles({
  root: {
    gridTemplateColumns: '1fr',
    gridTemplateAreas: `'privacy'
      'stepButtons'`,
  },
})

const Terms = ({ initialData }) => {
  const formRef = useRef()
  const classes = useStyles()
  return (
    <AutoForm
      schema={schema}
      onSubmit={console.log}
      placeholder
      ref={formRef}
      model={initialData}
      className={classes.root}
    >
      {Object.keys(TermsSchema.schema()).map((name, idx) => (
        <div key={idx} style={{ gridArea: name }}>
          <AutoField name={name} />
          <ErrorField
            name={name}
            errorMessage="You must accept the terms in order to create a new account"
          />
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
