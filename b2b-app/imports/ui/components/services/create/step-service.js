import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useTracker } from 'meteor/react-meteor-data'

import { ServiceContext } from './context'
import ServiceItems from '../../../../api/service-items/schema'

const StyledServiceStep = styled.div``

function serviceStepReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setSelectedItems':
      return { ...state, selectedItems: payload, updatedAt: new Date() }
    default:
      return state
  }
}

function ServiceStep({ initialData }) {
  const [state, dispatch] = useReducer(serviceStepReducer, {
    selectedItems: initialData?.selectedItems || [],
    updatedAt: new Date(),
    dataCheckResult: true,
    checkedAt: null,
  })

  const { setStepData, activeStep } = useContext(ServiceContext)
  const checkTimeout = useRef(null)

  const { selectedItems, dataCheckResult, checkedAt, updatedAt } = state

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
      items: selectedItems,
      updatedAt,
      dataCheckResult,
    })
  }, [checkedAt])

  const { items, loading } = useTracker(() => {
    const sub = Meteor.subscribe('all.serviceItems')
    return {
      items: ServiceItems.find({}).fetch(),
      loading: !sub.ready(),
    }
  }, [])

  if (activeStep !== 'service') {
    return null
  }

  const classes = ['servicestep-item-form']
  if (dataCheckResult === false) {
    classes.push('incomplete')
  }

  return (
    <StyledServiceStep>
      <div className={classes.join(' ')}>
        <div className="select-box-container">
          <Autocomplete
            options={items}
            getOptionLabel={(option) => `${option.name} $${option.price / 100}`}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Combo box" variant="outlined" />
            )}
          />
        </div>
        <div className="selected-items-container">Selected items here</div>
        <div className="popular-items-container">Popular items here</div>
      </div>
    </StyledServiceStep>
  )
}

ServiceStep.propTypes = {
  initialData: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object),
    selectedItems: PropTypes.arrayOf(PropTypes.object),
  }),
}

ServiceStep.defaultProps = {
  initialData: null,
}

export default ServiceStep
