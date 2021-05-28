import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Button } from '@material-ui/core'

import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoFields, TextField, ErrorsField } from 'uniforms-material'

import { ServiceContext } from './context'

const StyledPickupStep = styled.div`
  margin: 20px 0;
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

const pickupFormSchema = new SimpleSchema({
  dropOffDate: Date,
  pickupDate: Date,
  replacementBike: String,
  urgent: {
    type: Boolean,
    defaultValue: false,
  },
})

function pickupStepReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setPickup':
      return { ...state, pickup: payload, updatedAt: new Date() }
    case 'setHasValidData':
      return { ...state, hasValidData: payload, checkedAt: new Date() }
    default:
      return state
  }
}

function PickupStep({ initialData }) {
  const [state, dispatch] = useReducer(pickupStepReducer, {
    pickup: initialData?.pickup || { urgent: false },
    updatedAt: null,
    hasValidData: false,
    checkedAt: null,
  })

  const { setStepData, activeStep, goBack, setStepProperty, createJob } = useContext(
    ServiceContext
  )
  const checkTimeout = useRef(null)
  const formRef = useRef()

  const { pickup, hasValidData, checkedAt, updatedAt } = state

  const checkData = async () => {
    const checkResult = await formRef.current?.validateModel(pickup)
    dispatch({ type: 'setHasValidData', payload: checkResult === null })
    return checkResult === null
  }

  useEffect(() => {
    if (activeStep !== 'pickup' || !updatedAt) {
      return
    }

    Meteor.clearTimeout(checkTimeout.current)
    checkTimeout.current = Meteor.setTimeout(() => {
      checkData()
    }, 300)
  }, [updatedAt])

  useEffect(() => {
    if (activeStep !== 'pickup') {
      return
    }
    setStepData({
      stepKey: 'pickup',
      data: {
        pickup,
        updatedAt,
        hasValidData,
      },
    })
    setStepProperty({
      stepKey: 'pickup',
      property: 'completed',
      value: hasValidData,
    })
  }, [checkedAt])

  const handleSubmit = async () => {
    const checkResult = await checkData()
    if (checkResult) {
      console.log('create job')
      createJob()
    } else {
      console.log('something wrong')
    }
  }

  if (activeStep !== 'pickup') {
    return null
  }

  const classes = ['pickupstep-item-form']
  if (hasValidData === false) {
    classes.push('incomplete')
  }

  return (
    <StyledPickupStep>
      <div className={classes.join(' ')}>
        <div className="form-container">
          <AutoForm
            ref={formRef}
            schema={new SimpleSchema2Bridge(pickupFormSchema)}
            model={pickup}
            onSubmit={handleSubmit}
            onChange={(field, data) => {
              const newData = { ...pickup }
              newData[field] = data
              dispatch({ type: 'setPickup', payload: newData })
            }}
          >
            <TextField name="dropOffDate" type="date" />
            <TextField name="pickupDate" type="date" />
            <AutoFields omitFields={['dropOffDate', 'pickupDate']} />
            <ErrorsField />
            <div className="btns-container">
              <Button onClick={goBack}>Back</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  formRef.current.submit()
                }}
                disabled={!hasValidData}
              >
                Submit
              </Button>
            </div>
          </AutoForm>
        </div>
      </div>
    </StyledPickupStep>
  )
}

PickupStep.propTypes = {
  initialData: PropTypes.shape({
    pickup: PropTypes.object,
  }),
}

PickupStep.defaultProps = {
  initialData: null,
}

export default PickupStep
