import React, { useRef } from 'react'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, ErrorField, LongTextField } from 'uniforms-material'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import StepButtons from './step-buttons'

const AboutFormSchema = new SimpleSchema(
  {
    bikesHousehold: {
      type: SimpleSchema.Integer,
      uniforms: { label: 'Number of bikes you own' },
    },
    primaryBike: {
      type: String,
      uniforms: {
        label: 'Type of bike',
      },
      allowedValues: [
        'Road/racer',
        'Hybrid',
        'Mountain',
        'Cruiser',
        'Ladies',
        'Gents',
        'Fixie/Single Speed',
      ],
    },
    workStatus: {
      type: String,
      label: 'Employment status',
      allowedValues: [
        'Full Time',
        'Part Time',
        'Pension/Disability',
        'Unemployed',
        'Student',
        'Retired',
      ],
    },
    reasons: {
      type: String,
      uniforms: {
        label: 'Volunteer reasons',
        helperText:
          'What makes you want to to volunteer at Back2Bikes?\nHave you ever done any other volunteering before?\nHave you worked on bikes or something similar before?',
        component: LongTextField,
        rows: 6,
      },
    },
  },
  { requiredByDefault: false }
)

const schema = new SimpleSchema2Bridge(AboutFormSchema)

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
      schema={schema}
      onSubmit={console.log}
      placeholder
      ref={formRef}
      model={initialData}
      className={classes.root}
    >
      {Object.keys(AboutFormSchema.schema()).map((name, idx) => (
        <div key={idx} style={{ gridArea: name }}>
          <AutoField name={name} />
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
