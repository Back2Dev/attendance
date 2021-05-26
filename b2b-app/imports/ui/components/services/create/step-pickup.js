import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ServiceContext } from './context'

const StyledPickupStep = styled.div``

function pickupStepReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setItems':
      return { ...state, items: payload, updatedAt: new Date() }
    default:
      return state
  }
}

function PickupStep({ initialData }) {
  const [state, dispatch] = useReducer(pickupStepReducer, {
    items: initialData?.items || [],
    updatedAt: new Date(),
    hasValidData: true,
    checkedAt: null,
  })

  const { setStepData, activeStep } = useContext(ServiceContext)
  const checkTimeout = useRef(null)

  const { items, hasValidData, checkedAt, updatedAt } = state

  const checkData = async () => {
    // TODO: do something here
    dispatch({ type: 'setHasValidData', payload: true })
  }

  useEffect(() => {
    Meteor.clearTimeout(checkTimeout.current)
    checkTimeout.current = Meteor.setTimeout(() => {
      checkData()
    }, 300)
  }, [updatedAt])

  useEffect(() => {
    setStepData({
      items,
      updatedAt,
      hasValidData,
    })
  }, [checkedAt])

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
        <div>some pickup data</div>
      </div>
    </StyledPickupStep>
  )
}

PickupStep.propTypes = {
  initialData: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object),
  }),
}

PickupStep.defaultProps = {
  initialData: null,
}

export default PickupStep
