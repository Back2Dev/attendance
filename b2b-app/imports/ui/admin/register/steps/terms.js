import React, { useRef } from 'react'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import StepButtons from './step-buttons'
import { termsSchema } from '../form-schema'

const useStyles = makeStyles({
  root: {
    gridTemplateColumns: '1fr',
    gridTemplateAreas: `'terms'
      'privacy'
      'stepButtons'`,
  },
})

const Terms = ({ initialData }) => {
  const formRef = useRef()
  const classes = useStyles()
  return (
    <AutoForm
      schema={termsSchema}
      placeholder
      ref={formRef}
      model={initialData}
      className={classes.root}
    >
      <Typography style={{ gridArea: 'terms' }}>
        I consent to Back2bikes storing the information I have provided above. I
        understand that Back2bikes will not disclose the above information without my
        express consent other than for reasons related to my engagement as a volunteer.
      </Typography>
      {Object.keys(termsSchema.schema.schema()).map((name, idx) => (
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
