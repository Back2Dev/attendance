import React, { useContext } from 'react'
import ServiceItemTag from './service-item-tag'
import { ServiceContext } from './service-context'

export default function ServiceItemTagContainer() {
  const [state, setState] = useContext(ServiceContext)
  const tags = state.tags
  let totalServicePrice = state.totalServicePrice

  function calcTotalDeduction(tag) {
    if (tag.price) {
      priceDeduction = tag.price / 100
    } else {
      priceDeduction = tag.items.reduce((total, item) => {
        if (!item.greyed) {
          total += item.price / 100
        }
        return total
      }, 0)
    }
    return priceDeduction
  }

  function toggleExpand(tag) {
    const newTags = [...tags]

    console.log('tag passed as a parameter = ', tag)

    newTags.map(currentTag => {
      console.log('coming into toggle expand = ', currentTag)
      if (tag.name === currentTag.name) {
        currentTag.expanded = !currentTag.expanded
      }
    })

    const newState = { ...state, tags: newTags }
    setState(newState)
  }

  function removeTag(tag, index) {
    let priceDeduction = calcTotalDeduction(tag)

    console.log('priceDeduction = ', priceDeduction)

    const newTags = [...tags]
    newTags.splice(index, 1)
    const newState = { ...state, tags: newTags, totalServicePrice: totalServicePrice - priceDeduction }
    setState(newState)
  }

  function toggleTag(item, currentTag) {
    if (!item.greyed) {
      totalServicePrice = totalServicePrice - item.price / 100
    } else {
      totalServicePrice = totalServicePrice + item.price / 100
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
    const newState = { ...state, tags: newTags, totalServicePrice: totalServicePrice }
    setState(newState)
  }

  function majorMinorTotal(items) {
    let sum = items.reduce((total, item) => {
      if (!item.greyed) {
        total += item.price / 100
      }
      return total
    }, 0)
    return sum
  }

  return (
    <ServiceItemTag
      removeTag={removeTag}
      toggleTag={toggleTag}
      tags={tags}
      majorMinorTotal={majorMinorTotal}
      totalServicePrice={totalServicePrice}
      toggleExpand={toggleExpand}
    />
  )
}
