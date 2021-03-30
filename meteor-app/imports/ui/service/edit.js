import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import TagList from './tag-list'
import { ServiceContext } from './service-context'

const debug = require('debug')('b2b:service')

export default function ItemTag() {
  const [state, setState] = useContext(ServiceContext)
  const { tags } = state
  let totalCost = state.totalCost

  function toggleExpand(tag) {
    console.log(tag)
    const newTags = [...tags]

    debug('tag passed as a parameter = ', tag)

    newTags.map((currentTag) => {
      debug('coming into toggle expand = ', currentTag)
      if (tag.name === currentTag.name) {
        currentTag.expanded = !currentTag.expanded
      }
    })

    setState({ ...state, tags: newTags })
  }

  function removeTag(tag, index) {
    const newTags = [...tags]
    newTags.splice(index, 1)
    const newTotal = state.calculateTotal(tags)
    setState({ ...state, tags: newTags, totalCost: newTotal })
  }

  function toggleTag(item, currentTag) {
    if (!item.greyed) {
      currentTag.price -= item.price
    } else {
      currentTag.price += item.price
    }

    const newTags = [...tags]
    newTags.map((tag) => {
      tag.items
        ? tag.items.map((serviceItem) => {
            if (serviceItem.name === item.name && tag.name === currentTag.name) {
              serviceItem.greyed = !serviceItem.greyed
            }
          })
        : null
    })
    const newTotal = state.calculateTotal(tags)
    setState({ ...state, tags: newTags, totalCost: newTotal })
  }

  const adjustPrice = (tag, newValue) => {
    debug(`adjust price: ${newValue}`)
    const newState = { ...state }
    if (tag && tag.price !== null) {
      tag.price = parseFloat(newValue)
      const newTotal = state.calculateTotal(tags)
      setState({ ...newState, totalCost: newTotal })
    }
  }

  const changeTagName = (id, newTagName) => {
    debug(`new name: ${newTagName}`)
    const newState = { ...state }
    const tag = newState.tags.find((t) => id === t._id)
    if (tag) {
      tag.name = newTagName
    }
  }

  function majorMinorTotal(items) {
    let sum = items.reduce((total, item) => {
      if (!item.greyed) {
        total += item.price
      }
      return total
    }, 0)
    return sum
  }

  return (
    <TagList
      adjustPrice={adjustPrice}
      changeTagName={changeTagName}
      removeTag={removeTag}
      toggleTag={toggleTag}
      tags={tags}
      majorMinorTotal={majorMinorTotal}
      totalCost={totalCost}
      toggleExpand={toggleExpand}
    />
  )
}

TagList.propTypes = {
  removeTag: PropTypes.func.isRequired,
  toggleTag: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  majorMinorTotal: PropTypes.func.isRequired,
  totalCost: PropTypes.func.isRequired,
  toggleExpand: PropTypes.func.isRequired,
}
