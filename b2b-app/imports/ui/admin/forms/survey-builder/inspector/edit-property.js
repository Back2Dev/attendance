import React from 'react'
import PropTypes from 'prop-types'
import { selectorFamily, useRecoilState } from 'recoil'
import { get as lget, set as lset, isPlainObject } from 'lodash'
import produce from 'immer'
import { singleState } from '../single/single'

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

  const createProperties = (val, relPath = '') => {
    const curPath = path + relPath
    if (typeof val === 'string' || val === undefined) {
      const label = curPath.slice(curPath.lastIndexOf('.') + 1)
      return (
        <div>
          <label>{label}</label>
          <input type="text" value={val} onChange={(e) => setProperty(e.target.value)} />
        </div>
      )
    } else if (Array.isArray(val)) {
      const children = val.map((arrEl, i) => {
        if (typeof arrEl === 'string') {
          return createProperties(arrEl, `[${i}]`)
        } else if (isPlainObject(arrEl)) {
          return Object.entries(arrEl).map(([objKey, objVal]) => {
            return createProperties(objVal, `[${i}].${objKey}`)
          })
        }
      })
      return <>{children}</>
    }
    return null
  }

  return createProperties(property)
}

EditProperty.propTypes = {
  id: PropTypes.number,
  path: PropTypes.string,
  label: PropTypes.string,
}

export default EditProperty
