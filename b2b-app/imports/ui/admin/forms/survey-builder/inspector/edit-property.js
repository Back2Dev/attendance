import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import { selectorFamily, useRecoilState } from 'recoil'
import { get as lget, set as lset, isPlainObject } from 'lodash'
import produce from 'immer'
import { singleState } from '../types'

/** Edit a property for a single question type */
export const editPropertyState = selectorFamily({
  key: 'editProperty',
  get: ({ pid, path }) => ({ get }) => {
    const single = get(singleState(pid))
    const state = lget(single, path)
    return state
  },
  set: ({ pid, path }) => ({ get, set }, newValue) => {
    const single = get(singleState(pid))
    const nextState = produce(single, (draft) => {
      lset(draft, path, newValue)
    })
    set(singleState(pid), nextState)
  },
})

const EditProperty = ({ pid, path }) => {
  const [property, setProperty] = useRecoilState(editPropertyState({ pid, path }))

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
      return createElement(EditProperty, { key: i, pid, path: `${path}[${i}]` })
    })
    return <>{children}</>
  } else if (isPlainObject(property)) {
    return Object.keys(property).map((key, j) => {
      return createElement(EditProperty, { key: j, pid, path: `${path}.${key}` })
    })
  }
  return null
}

EditProperty.propTypes = {
  /** part instance id */
  pid: PropTypes.string.isRequired,
  /** path of state. can be a key to a string, object or array of objects */
  path: PropTypes.string,
}

export default EditProperty
