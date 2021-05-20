import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { ServiceContext } from './context'

const StyledContactStep = styled.div``

function contactStepReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setItems':
      return { ...state, items: payload, updatedAt: new Date() }
    default:
      return state
  }
}

function ContactStep({ initialData }) {
  const [state, dispatch] = useReducer(contactStepReducer, {
    items: initialData?.items || [],
    updatedAt: new Date(),
    dataCheckResult: true,
    checkedAt: null,
  })

  const { setStepData, activeStep } = useContext(ServiceContext)
  const checkTimeout = useRef(null)

  const { items, dataCheckResult, checkedAt, updatedAt } = state

  const checkData = async () => {
    // TODO: do something here
    dispatch({ type: 'setDataCheckResult', payload: true })
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
      dataCheckResult,
    })
  }, [checkedAt])

  if (activeStep !== 'contact') {
    return null
  }

  const classes = ['contactstep-item-form']
  if (dataCheckResult === false) {
    classes.push('incomplete')
  }

  return (
    <StyledContactStep>
      <div className={classes.join(' ')}>
        <div>some contact data</div>
      </div>
    </StyledContactStep>
  )
}

ContactStep.propTypes = {
  initialData: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object),
  }),
}

ContactStep.defaultProps = {
  initialData: null,
}

export default ContactStep
