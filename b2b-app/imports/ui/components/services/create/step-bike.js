import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, TextField, ErrorsField } from 'uniforms-material'

import { ServiceContext } from './context'
import { Button } from '@material-ui/core'
import moment from 'moment'

const bikeFormSchema = new SimpleSchema({
  assessor: String,
  bikeName: String,
  dropoffDate: Date,
  pickupDate: { type: Date, optional: true },
  budget: {
    type: Number,
    label: 'Budget',
    optional: true,
  },
  replacementBike: {
    type: String,
    optional: true,
    label: 'Replacement bike (make/model/colour)',
  },
  note: {
    type: String,
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
    details: initialData?.details || {
      dropoffDate: moment().format('YYYY-MM-DD'),
      pickupDate: moment().add(7, 'days').format('YYYY-MM-DD'),
    },
    updatedAt: null,
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

  const autoValidate = useRef(false)

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
    return checkResult === null
  }

  const handleSubmit = async () => {
    const checkResult = await checkData()

    setStepData({
      stepKey: 'bike',
      data: {
        details,
        updatedAt,
        hasValidData: checkResult,
      },
    })
    setStepProperty({
      stepKey: 'bike',
      property: 'completed',
      value: checkResult,
    })
    if (checkResult && activeStep === 'bike') {
      goNext()
    }
  }

  useEffect(() => {
    if (originalData) {
      console.log('originalData', originalData)
      dispatch({
        type: 'setDetails',
        payload: {
          assessor: originalData.assessor,
          bikeName: originalData.bikeName,
          dropoffDate: originalData.dropoffDate
            ? moment(originalData.dropoffDate).format('YYYY-MM-DD')
            : '',
          pickupDate: originalData.pickupDate
            ? moment(originalData.pickupDate).format('YYYY-MM-DD')
            : '',
          budget: originalData.budget,
          note: originalData.note,
        },
      })
      autoValidate.current = true
    }
  }, [originalData])

  useEffect(() => {
    if (!autoValidate.current) {
      return
    }
    // if (activeStep !== 'bike') {
    //   return
    // }
    console.log('effect check data', updatedAt)
    Meteor.clearTimeout(checkTimeout.current)
    checkTimeout.current = Meteor.setTimeout(() => {
      checkData()
    }, 300)
  }, [updatedAt])

  useEffect(() => {
    if (!checkedAt) {
      return
    }
    // if (activeStep !== 'contact') {
    //   return
    // }
    console.log('checkedAt effect', checkedAt)
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
          {/* <AutoFields variant="outlined" /> */}
          <AutoField name="assessor" variant="outlined" />
          <AutoField name="bikeName" variant="outlined" />
          <TextField
            value={details.dropoffDate}
            name="dropoffDate"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            type="date"
          />
          <TextField
            value={details.pickupDate}
            name="pickupDate"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            type="date"
          />
          <AutoField name="budget" variant="outlined" />
          <AutoField name="replacementBike" variant="outlined" />
          <AutoField name="note" variant="outlined" />
          <ErrorsField />
          <div className="btns-container">
            <Button onClick={goBack}>Back</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                autoValidate.current = true
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
