import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import TagList from './tag-list'
import { ServiceContext } from './service-context'

const debug = require('debug')('b2b:service')

export default function ItemTag() {
  const [state, setState] = useContext(ServiceContext)
  const { tags } = state

  function toggleExpand(tag) {
    console.log(tag)
    const newTags = [...tags]

    debug('tag passed as a parameter = ', tag)

    newTags.map(currentTag => {
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
    setState({ ...state, tags: newTags })
  }

  function toggleTag(item, currentTag) {
    if (!item.greyed) {
      currentTag.price -= item.price
    } else {
      currentTag.price += item.price
    }

    const newTags = [...tags]
    newTags.map(tag => {
      tag.items
        ? tag.items.map(serviceItem => {
            if (serviceItem.name === item.name && tag.name === currentTag.name) {
              serviceItem.greyed = !serviceItem.greyed
            }
          })
        : null
    })
    setState({ ...state, tags: newTags, totalPrice })
  }

  const totalPrice = tags => {
    let total = 0
    tags.map(tag => {
      total += tag.price
    })
    return total
  }

  const adjustPrice = (id, newValue) => {
    debug(`adjust price: ${newValue}`)
    const newState = { ...state }

    const tag = newState.tags.find(t => id === t._id)
    if (tag && tag.price !== null) {
      newState.totalPrice -= parseFloat(tag.price)
      tag.price = parseFloat(newValue)
      newState.totalPrice += parseFloat(newValue)
      setState(newState)
    }
  }

  const changeTagName = (id, newTagName) => {
    debug(`new name: ${newTagName}`)
    const newState = { ...state }
    const tag = newState.tags.find(t => id === t._id)
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
      totalPrice={totalPrice}
      toggleExpand={toggleExpand}
    />
  )
}

TagList.propTypes = {
  removeTag: PropTypes.func.isRequired,
  toggleTag: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  majorMinorTotal: PropTypes.func.isRequired,
  totalPrice: PropTypes.number.isRequired,
  toggleExpand: PropTypes.func.isRequired
}
