import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import React, { useEffect, useRef, useReducer, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useTracker } from 'meteor/react-meteor-data'

import { ServiceContext } from './context'
import ServiceItems from '../../../../api/service-items/schema'
import ServiceItem from './service-item'

const StyledServiceStep = styled.div``

function serviceStepReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setSelectedItems':
      return { ...state, selectedItems: payload, updatedAt: new Date() }
    case 'addItem': {
      const newItem = {
        ...payload,
        localId: Random.id(),
      }
      return {
        ...state,
        selectedItems: [...state.selectedItems, newItem],
        currentItem: null,
        updatedAt: new Date(),
      }
    }
    case 'removeItem': {
      const newItems = []
      state.selectedItems.map((item) => {
        if (item.localId !== payload.localId) {
          newItems.push(item)
        }
      })
      return { ...state, selectedItems: newItems, updatedAt: new Date() }
    }
    case 'setCurrentItem':
      return { ...state, currentItem: payload }
    default:
      return state
  }
}

function ServiceStep({ initialData }) {
  const [state, dispatch] = useReducer(serviceStepReducer, {
    currentItem: null,
    selectedItems: initialData?.selectedItems || [],
    updatedAt: new Date(),
    dataCheckResult: true,
    checkedAt: null,
  })

  const { setStepData, activeStep } = useContext(ServiceContext)
  const checkTimeout = useRef(null)

  const { currentItem, selectedItems, dataCheckResult, checkedAt, updatedAt } = state

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
      stepKey: 'service',
      data: {
        items: selectedItems,
        updatedAt,
        dataCheckResult,
      },
    })
  }, [checkedAt])

  const { items, loading } = useTracker(() => {
    const sub = Meteor.subscribe('all.serviceItems')
    return {
      items: ServiceItems.find({}).fetch(),
      loading: !sub.ready(),
    }
  }, [])

  const handleSelected = (item) => {
    dispatch({ type: 'addItem', payload: item })
  }

  if (activeStep !== 'service') {
    return null
  }

  const classes = ['servicestep-item-form']
  if (dataCheckResult === false) {
    classes.push('incomplete')
  }

  const renderSelectedItems = () => {
    return selectedItems.map((item) => (
      <ServiceItem
        key={item.localId}
        item={item}
        onRemove={() => {
          dispatch({ type: 'removeItem', payload: item })
        }}
      />
    ))
  }

  return (
    <StyledServiceStep>
      <div className={classes.join(' ')}>
        <div className="select-box-container">
          <Autocomplete
            value={currentItem}
            options={items}
            getOptionLabel={(option) => `${option.name} $${option.price / 100}`}
            style={{ width: 350 }}
            renderInput={(params) => (
              <TextField {...params} label="Select a Service item" variant="outlined" />
            )}
            onChange={(event, selected) => {
              handleSelected(selected)
            }}
          />
        </div>
        <div className="selected-items-container">{renderSelectedItems()}</div>
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
  initialData: {},
}

export default ServiceStep
