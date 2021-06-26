import React, { useRef, useEffect } from 'react'
import { AutoForm, AutoField, ErrorField } from 'uniforms-material'
import { useField } from 'uniforms'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import StepButtons from './step-buttons'
import { aboutBridge } from '../form-bridge'

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

const BikeTypeField = (rawProps) => {
  const [{ value: bikesNum }] = useField('bikesHousehold', rawProps)
  const [{ onChange }] = useField('primaryBike', rawProps)
  useEffect(() => {
    if (bikesNum === 0) {
      onChange(null)
    }
  }, [bikesNum])

  return <AutoField name="primaryBike" disabled={bikesNum === 0} />
}

const About = ({ initialData }) => {
  const formRef = useRef()
  const classes = useStyles()
  return (
    <AutoForm
      schema={aboutBridge}
      placeholder
      ref={formRef}
      model={initialData}
      className={classes.root}
    >
      {Object.keys(aboutBridge.schema.schema()).map((name, idx) => (
        <div key={idx} style={{ gridArea: name }}>
          {name === 'primaryBike' ? (
            <BikeTypeField />
          ) : (
            <AutoField name={name} autoFocus={idx === 0} />
          )}
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
