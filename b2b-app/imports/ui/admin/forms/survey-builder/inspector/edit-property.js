import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import { selectorFamily, useRecoilState } from 'recoil'
import { get as lget, set as lset, isPlainObject } from 'lodash'
import produce from 'immer'
import { singleState } from '../types/single/single'

/** Edit a property for a single question type */
export const editPropertyState = selectorFamily({
  key: 'editProperty',
  get: ({ id, path }) => ({ get }) => {
    const single = get(singleState(id))
    const state = lget(single, path)
    return state
  },
  set: ({ id, path }) => ({ get, set }, newValue) => {
    const single = get(singleState(id))
    const nextState = produce(single, (draft) => {
      lset(draft, path, newValue)
    })
    set(singleState(id), nextState)
  },
})

const EditProperty = ({ id, path }) => {
  const [property, setProperty] = useRecoilState(editPropertyState({ id, path }))

  if (typeof property === 'string') {
    const label = path.slice(path.lastIndexOf('.') + 1)

    return (
      <div>
        <label>{label}</label>
        <input
          type="text"
          value={property}
          onChange={(e) => setProperty(e.target.value)}
        />
      </div>
    )
  } else if (Array.isArray(property)) {
    const children = property.map((_, i) => {
      return createElement(EditProperty, { key: i, id, path: `${path}[${i}]` })
    })
    return <>{children}</>
  } else if (isPlainObject(property)) {
    return Object.keys(property).map((key, j) => {
      return createElement(EditProperty, { key: j, id, path: `${path}.${key}` })
    })
  }
  return null
}

EditProperty.propTypes = {
  /** part id */
  id: PropTypes.number,
  /** path of state. can be a key to a string, object or array of objects */
  path: PropTypes.string,
}

export default EditProperty
