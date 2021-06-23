import React, { useRef } from 'react'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import StepButtons from './step-buttons'
import { aboutSchema } from '../form-schema'

const useStyles = makeStyles({
  root: {
    gridTemplateColumns: '40% 60%',
    gridTemplateAreas: `'bikesHousehold primaryBike'
      'workStatus workStatus'
      'reasons reasons'
      'stepButtons stepButtons'
    `,
  },
})

const About = ({ initialData }) => {
  const formRef = useRef()
  const classes = useStyles()
  return (
    <AutoForm
      schema={aboutSchema}
      placeholder
      ref={formRef}
      model={initialData}
      className={classes.root}
    >
      {Object.keys(aboutSchema.schema.schema()).map((name, idx) => (
        <div key={idx} style={{ gridArea: name }}>
          <AutoField name={name} autoFocus={idx === 0} />
          <ErrorField name={name} />
        </div>
      ))}
      <StepButtons formRef={formRef} />
    </AutoForm>
  )
}

About.propTypes = {
  initialData: PropTypes.object,
}

About.defaultProps = {
  initialData: {},
}

export default About
