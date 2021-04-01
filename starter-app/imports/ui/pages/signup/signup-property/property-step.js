import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { Context, useForm } from 'uniforms'
import {
  AutoForm,
  AutoField,
  ErrorsField,
  SubmitField,
  RadioField,
} from 'uniforms-material'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import GooglePlaces from '/imports/ui/components/google-places.js'

const listingSchema = new SimpleSchema2Bridge(
  new SimpleSchema({
    transactionType: {
      type: String,
      allowedValues: ['buy', 'sell', 'contract-review'],
      uniforms: {
        label: 'Are you buying or selling this property?',
        transform: (value) => {
          return {
            buy: 'I am buying',
            sell: 'I am selling',
            'contract-review': 'I would like a contract review',
          }[value]
        },
      },
    },
    botp: {
      type: String,
      allowedValues: ['yes', 'no'],
      uniforms: {
        label: 'Are you buying off the plan?',
        transform: (value) => {
          return {
            yes: 'Yes',
            no: 'No',
          }[value]
        },
      },
      optional: true,
      defaultValue: 'no',
    },
    propertyAddress: {
      type: String,
      uniforms: { component: GooglePlaces },
    },
  })
)

const DisplayIf = ({ children, condition }) => {
  const uniforms = useForm()
  return condition(uniforms) ? children : null
}

const useStyles = makeStyles((theme) => ({
  radioGroup: { '& .MuiFormGroup-root': { display: 'inline' } },
}))

const PropertyStep = ({ activeStep, setActiveStep }) => {
  const classes = useStyles()

  const addProperty = (form) => {
    sessionStorage.setItem('propertyDetails', JSON.stringify(form))
    setActiveStep(activeStep + 1)
  }

  const prefilled = sessionStorage.getItem('propertyDetails')
    ? JSON.parse(sessionStorage.getItem('propertyDetails'))
    : {}

  return (
    <AutoForm schema={listingSchema} onSubmit={(e) => addProperty(e)} model={prefilled}>
      <Typography variant="h1">Add property</Typography>
      <br />
      <div className={classes.radioGroup}>
        <RadioField name="transactionType" />
      </div>
      <DisplayIf
        condition={(uniforms) => {
          return uniforms.model.transactionType === 'buy'
        }}
      >
        <div className={classes.radioGroup}>
          <RadioField name="botp" />
        </div>
      </DisplayIf>
      <AutoField
        name="propertyAddress"
        defaultValue={prefilled ? prefilled.propertyAddress : ''}
        label="Property address*"
      />
      <ErrorsField />
      <br />
      <SubmitField id="next-button" color="primary" variant="contained" fullWidth>
        Next
      </SubmitField>
    </AutoForm>
  )
}

PropertyStep.propTypes = { activeStep: PropTypes.number, setActiveStep: PropTypes.func }

export default PropertyStep
