import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { useHistory } from 'react-router'
import React, { useEffect, useRef, useReducer, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TextField, Button, Typography } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useTracker } from 'meteor/react-meteor-data'

import { ServiceContext } from './context'
import ServiceItems from '../../../../api/service-items/schema'
import ServiceItem from './service-item'
import Loading from '../../commons/loading'

const StyledServiceStep = styled.div`
  margin: 20px 0;
  .btns-container {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .tags-selector {
    button {
      margin: 5px 0;
    }
  }
  .total-cost {
    margin: 10px 0;
    font-weight: bold;
  }
  .popular-items-container {
    margin: 10px 0;
    .items-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .item {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
`

function serviceStepReducer(state, action) {
  const { type, payload } = action
  const getTotalCost = (items) => {
    if (!items?.length) {
      return 0
    }
    return items.reduce((sum, item) => sum + item.price, 0)
  }

  switch (type) {
    case 'updateSelectedItem': {
      const newItems = state.selectedItems.map((item) => {
        if (item.localId === payload.localId) {
          return payload
        }
        return item
      })
      return {
        ...state,
        selectedItems: newItems,
        totalCost: getTotalCost(newItems),
        updatedAt: new Date(),
      }
    }
    case 'setSelectedItems':
      return {
        ...state,
        selectedItems: payload,
        totalCost: getTotalCost(payload),
        updatedAt: new Date(),
      }
    case 'addItem': {
      const newItem = {
        ...payload,
        localId: Random.id(),
      }
      const selectedItems = [...state.selectedItems, newItem]
      return {
        ...state,
        selectedItems,
        totalCost: getTotalCost(selectedItems),
        currentItem: null,
        updatedAt: new Date(),
      }
    }
    case 'addItems': {
      const selectedItems = [...state.selectedItems, ...payload]
      return {
        ...state,
        selectedItems,
        totalCost: getTotalCost(selectedItems),
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
      return {
        ...state,
        selectedItems: newItems,
        totalCost: getTotalCost(newItems),
        updatedAt: new Date(),
      }
    }
    case 'setCurrentItem':
      return { ...state, currentItem: payload }
    case 'setHasValidData':
      return { ...state, hasValidData: payload, checkedAt: new Date() }
    default:
      return state
  }
}

function ServiceStep({ initialData }) {
  const [state, dispatch] = useReducer(serviceStepReducer, {
    currentItem: null,
    selectedItems: initialData?.selectedItems || [],
    totalCost: 0,
    updatedAt: new Date(),
    hasValidData: false,
    checkedAt: null,
  })

  const { goBack } = useHistory()

  const { setStepData, setStepProperty, activeStep, goNext, originalData } = useContext(
    ServiceContext
  )
  const checkTimeout = useRef(null)
  const searchFieldRef = useRef(null)
  const selectedContRef = useRef(null)

  const { currentItem, selectedItems, hasValidData, checkedAt, updatedAt } = state

  const checkData = async () => {
    // make sure atleast one item selected
    dispatch({ type: 'setHasValidData', payload: selectedItems.length > 0 })
  }

  const { items, loading } = useTracker(() => {
    const sub = Meteor.subscribe('all.serviceItems')
    return {
      items: ServiceItems.find({}).fetch(),
      loading: !sub.ready(),
    }
  }, [])

  const sortedItems = useMemo(() => {
    const sorted = items.sort((a, b) => (b.numbersOfUsed || 0) - (a.numbersOfUsed || 0))
    return sorted
  }, [items])

  useEffect(() => {
    if (originalData?.serviceItems?.length && items?.length) {
      const itemsToBeAdded = originalData?.serviceItems.map((item) => {
        return {
          ...item,
          localId: Random.id(),
        }
      })
      // console.log('itemsToBeAdded', itemsToBeAdded)
      if (itemsToBeAdded?.length) {
        dispatch({ type: 'addItems', payload: itemsToBeAdded })
      }
    }
  }, [originalData, items])

  useEffect(() => {
    if (activeStep !== 'service') {
      return
    }
    Meteor.clearTimeout(checkTimeout.current)
    checkTimeout.current = Meteor.setTimeout(() => {
      checkData()
    }, 300)
  }, [updatedAt])

  useEffect(() => {
    // if (activeStep !== 'service') {
    //   return
    // }
    setStepData({
      stepKey: 'service',
      data: {
        items: selectedItems,
        updatedAt,
        hasValidData,
      },
    })
    setStepProperty({
      stepKey: 'service',
      property: 'completed',
      value: hasValidData,
    })
  }, [checkedAt])

  const handleSelected = (item) => {
    dispatch({ type: 'addItem', payload: item })
    // calling blur on input field to clear the selected item from the autocomplete
    // would not work if material-ui changed
    setTimeout(() => {
      searchFieldRef.current?.children[0]?.children[1]?.children[0]?.blur()
    }, 300)
  }

  const selectItemsWithTag = (tag) => {
    // console.log(tag)
    // find all service items by tag
    const itemsToBeAdded = []
    items.map((item) => {
      if (item.tags?.length && item.tags.includes(tag)) {
        // console.log('item has tag', item)
        // check if this item has selected already, and hasn't been modified
        if (
          !selectedItems.find(
            (selected) => selected._id === item._id && !selected.modifiedAt
          )
        ) {
          // then add the item to the selected list
          itemsToBeAdded.push({ ...item, localId: Random.id() })
        }
      }
    })
    if (itemsToBeAdded.length) {
      dispatch({ type: 'addItems', payload: itemsToBeAdded })
    }
  }

  if (activeStep !== 'service') {
    return null
  }

  const classes = ['servicestep-item-form']
  if (hasValidData === false) {
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
        onChange={(updatedServiceItem) => {
          // console.log({ updatedServiceItem })
          dispatch({ type: 'updateSelectedItem', payload: updatedServiceItem })
        }}
      />
    ))
  }

  const renderPopularItems = () => {
    if (!sortedItems?.length) {
      return null
    }
    return (
      <div className="popular-items-container">
        <Typography variant="h3">Popular service items</Typography>
        <div className="items-wrapper">
          {sortedItems.map((item, index) => {
            if (index > 10) {
              return null
            }
            return (
              <div className="item" key={item._id}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    dispatch({ type: 'addItem', payload: item })
                  }}
                >
                  {item.name} - ${item.price / 100}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <StyledServiceStep>
      <div className={classes.join(' ')}>
        <Loading loading={loading} />
        <div className="select-box-container">
          <Autocomplete
            ref={searchFieldRef}
            value={currentItem}
            options={items}
            getOptionLabel={(option) => `${option.name} $${option.price / 100}`}
            style={{ maxWidth: 450, minWidth: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a Service item"
                variant="outlined"
                size="small"
              />
            )}
            onChange={(event, selected) => {
              handleSelected(selected)
            }}
            clearOnBlur
          />
        </div>
        <div className="selected-items-container" ref={selectedContRef}>
          {renderSelectedItems()}
        </div>
        <div className="total-cost">Total cost: ${state.totalCost / 100}</div>
        <div className="btns-container">
          <Button
            className="next-btn"
            variant="contained"
            onClick={() => {
              goBack()
            }}
            testid="service-back-btn"
          >
            Back
          </Button>
          <Button
            className="next-btn"
            variant="contained"
            color="primary"
            disabled={!hasValidData}
            onClick={() => {
              goNext()
            }}
          >
            Next
          </Button>
        </div>
        <div className="tags-selector">
          <div>
            <Button
              className="major-tag-btn"
              variant="contained"
              onClick={() => {
                selectItemsWithTag('Major')
              }}
            >
              Select Major items
            </Button>
          </div>
          <div>
            <Button
              className="minor-tag-btn"
              variant="contained"
              onClick={() => {
                selectItemsWithTag('Minor')
              }}
            >
              Select Minor items
            </Button>
          </div>
        </div>
        {renderPopularItems()}
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
