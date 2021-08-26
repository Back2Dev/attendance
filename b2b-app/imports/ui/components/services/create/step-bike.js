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
  color: String,
  // type: {
  //   //type: String,
  //   allowedValues: [
  //     'Moutain Bike',
  //     'Road Bike',
  //     'Hybrid Bike',
  //     'BMX Bike',
  //     'Ladies Bike',
  //     'Gents Bike',
  //     'Vintage Bike',
  //     'Other',
  //   ],
  // },
  type: String,
  budget: {
    type: Number,
    label: 'Budget',
  },
  approxValue: {
    type: Number,
    label: 'Approx. value',
    optional: true,
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

  const {
    setStepData,
    setStepProperty,
    goNext,
    goBack,
    activeStep,
    originalData,
  } = useContext(ServiceContext)
  const formRef = useRef()
  const checkTimeout = useRef(null)

  const mounted = useRef(true)
  useEffect(
    () => () => {
      mounted.current = false
    },
    []
  )

  const { details, hasValidData, updatedAt, checkedAt } = state

  const checkData = async () => {
    console.log('checkData', details, formRef.current)
    // if (!formRef.current) {
    //   dispatch({ type: 'setHasValidData', payload: true })
    //   return
    // }
    // const checkResult = await formRef.current?.validate()
    const checkResult = await formRef.current?.validateModel(details)
    console.log({ checkResult }, mounted.current)
    if (mounted.current) {
      dispatch({ type: 'setHasValidData', payload: checkResult === null })
    }
  }

  const handleSubmit = () => {
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
    if (hasValidData && activeStep === 'bike') {
      goNext()
    }
  }

  useEffect(() => {
    if (originalData) {
      console.log('originalData', originalData)
      dispatch({
        type: 'setDetails',
        payload: {
          make: originalData.make,
          model: originalData.model,
          color: originalData.color,
          type: originalData.bikeType,
          budget: originalData.budget,
          approxValue: originalData.bikeValue,
        },
      })
      // dispatch({ type: 'setHasValidData', payload: true })
      // checkData()
    }
  }, [originalData])

  useEffect(() => {
    // if (activeStep !== 'bike') {
    //   return
    // }
    console.log('effect check data')
    Meteor.clearTimeout(checkTimeout.current)
    checkTimeout.current = Meteor.setTimeout(() => {
      checkData()
    }, 300)
  }, [updatedAt])

  useEffect(() => {
    // if (activeStep !== 'contact') {
    //   return
    // }
    // console.log('checkedAt effect')
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
  }, [checkedAt])

  if (activeStep !== 'bike') {
    // return null
  }

  const classes = ['form-container']
  if (hasValidData === false) {
    classes.push('incomplete')
  }

  return (
    <StyledBikeStep style={{ display: activeStep !== 'bike' ? 'none' : 'block' }}>
      <div className={classes.join(' ')}>
        <AutoForm
          ref={formRef}
          schema={new SimpleSchema2Bridge(bikeFormSchema)}
          model={details}
          onChangeModel={(model) => {
            // console.log(model)
            dispatch({ type: 'setDetails', payload: model })
          }}
          onSubmit={() => {
            handleSubmit()
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
