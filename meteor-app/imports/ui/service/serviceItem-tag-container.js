import React, { useContext } from 'react'
import ServiceItemTag from './serviceItem-tag'
import { ServiceContext } from './service-context'

export default function ServiceItemTagContainer() {
  const [state, setState] = useContext(ServiceContext)
  const tags = state.tags
  const totalServicePrice = state.totalServicePrice

  console.log('state =', state)

  function removeTag(index) {
    const newTags = [...tags]
    newTags.splice(index, 1)
    const newState = { ...state, tags: newTags }
    setState(newState)
  }

  function toggleTag(item, currentTag) {
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
    const newState = { ...state, tags: newTags }
    setState(newState)
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
    <ServiceItemTag
      removeTag={removeTag}
      toggleTag={toggleTag}
      tags={tags}
      majorMinorTotal={majorMinorTotal}
      totalServicePrice={totalServicePrice}
    />
  )
}
