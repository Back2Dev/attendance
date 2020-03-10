import React, { useContext } from 'react'
import ServiceItemTag from './serviceItem-tag'
import { ServiceContext } from './service-context'

export default function ServiceItemTagContainer() {
  const [state, setState] = useContext(ServiceContext)
  const tags = state.tags

  function removeTag(index) {
    const newTags = [...tags]
    newTags.splice(index, 1)
    const newState = { ...state, tags: newTags }
    setState(newState)
  }

  function toggleTag(item) {
    const newTags = [...tags]
    newTags.map(tag => {
      tag.items
        ? tag.items.map(serviceItem => {
            if (serviceItem.title === item.title) {
              serviceItem.greyed = !serviceItem.greyed
            }
          })
        : null
    })
    const newState = { ...state, tags: newTags }
    setState(newState)
  }

  return <ServiceItemTag removeTag={removeTag} toggleTag={toggleTag} tags={tags} />
}
