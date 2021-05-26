import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoFields, ErrorsField } from 'uniforms-material'

import { ServiceContext } from './context'
import { Button } from '@material-ui/core'

const bikeFormSchema = new SimpleSchema({
  make: String,
  model: String,
  colour: String,
  type: {
    type: String,
    allowedValues: [
      'Moutain Bike',
      'Road Bike',
      'Hybrid Bike',
      'BMX Bike',
      'Ladies Bike',
      'Gents Bike',
      'Vintage Bike',
      'Other',
    ],
  },
  approxValue: {
    type: String,
    label: 'Approx. Value',
  },
})

const StyledBikeStep = styled.div`
  .form-container {
    max-width: 500px;
    margin: 0 auto;
  }
  .btns-container {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
`

function bikeStepReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setDetails':
      return { ...state, details: payload, updatedAt: new Date() }
    case 'setHasValidData':
      return { ...state, hasValidData: payload, checkedAt: new Date() }
    default:
      return state
  }
}

function BikeStep({ initialData }) {
  const [state, dispatch] = useReducer(bikeStepReducer, {
    details: initialData?.details || {},
    updatedAt: new Date(),
    hasValidData: false,
    checkedAt: null,
  })

  const { setStepData, setStepProperty, goNext, goBack, activeStep } = useContext(
    ServiceContext
  )
  const formRef = useRef()
  const checkTimeout = useRef(null)

  const { details, hasValidData, checkedAt, updatedAt } = state

  const checkData = async () => {
    // TODO: do something here
    // const checkResult = await formRef.current?.validate()
    const checkResult = await formRef.current?.validateModel(details)
    dispatch({ type: 'setHasValidData', payload: checkResult === null })
  }

  useEffect(() => {
    if (activeStep !== 'bike') {
      return
    }
    Meteor.clearTimeout(checkTimeout.current)
    checkTimeout.current = Meteor.setTimeout(() => {
      checkData()
    }, 300)
  }, [updatedAt])

  useEffect(() => {
    if (activeStep !== 'bike') {
      return
    }
    setStepData({
      stepKey: 'bike',
      data: {
        details,
        updatedAt,
        hasValidData,
      },
    })
    setStepProperty({
      stepKey: 'bike',
      property: 'completed',
      value: hasValidData,
    })
    if (hasValidData) {
      goNext()
    }
  }, [checkedAt])

  if (activeStep !== 'bike') {
    return null
  }

  const classes = ['form-container']
  if (hasValidData === false) {
    classes.push('incomplete')
  }

  return (
    <StyledBikeStep>
      <div className={classes.join(' ')}>
        <AutoForm
          ref={formRef}
          schema={new SimpleSchema2Bridge(bikeFormSchema)}
          model={details}
          onSubmit={(model) => {
            // console.log(model)
            dispatch({ type: 'setDetails', payload: model })
          }}
        >
          <AutoFields />
          <ErrorsField />
          <div className="btns-container">
            <Button onClick={goBack}>Back</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                formRef.current.submit()
              }}
            >
              Submit
            </Button>
          </div>
        </AutoForm>
      </div>
    </StyledBikeStep>
  )
}

BikeStep.propTypes = {
  initialData: PropTypes.shape({
    details: PropTypes.object,
  }),
}

BikeStep.defaultProps = {
  initialData: null,
}

export default BikeStep
