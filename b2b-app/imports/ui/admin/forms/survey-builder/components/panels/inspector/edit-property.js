import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'
import { isPlainObject } from 'lodash'
import { editInspectorState } from '$sb/recoil/atoms'
import debug from 'debug'
import { TextField } from '@material-ui/core'

const log = debug('builder:edit-property')

const EditProperty = ({ pid, path, relabel }) => {
  // TODO convert into recoil hook
  const [property, setProperty] = useRecoilState(editInspectorState({ pid, path }))

  if (typeof property === 'string') {
    let label
    if (typeof relabel === 'string') {
      label = relabel
    } else if (typeof relabel === 'function') {
      label = relabel(path)
    } else {
      label = path.slice(path.lastIndexOf('.') + 1)
    }

    return (
      <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
        <TextField
          variant="outlined"
          label={label}
          value={property}
          onChange={(e) => setProperty(e.target.value)}
        />
      </div>
      // <div>
      //   <label>{label}</label>
      //   <input
      //     type="text"
      //     value={property}
      //     onChange={(e) => setProperty(e.target.value)}
      //   />
      // </div>
    )
  } else if (Array.isArray(property)) {
    const children = property.map((_, i) => {
      return createElement(EditProperty, { key: i, pid, path: `${path}[${i}]`, relabel })
    })
    return <>{children}</>
  } else if (isPlainObject(property)) {
    return Object.keys(property).map((key, j) => {
      return createElement(EditProperty, { key: j, pid, path: `${path}.${key}`, relabel })
    })
  }
  return null
}

EditProperty.propTypes = {
  /** part instance id */
  pid: PropTypes.string.isRequired,
  /** path of state. can be a key to a string, object or array of objects */
  path: PropTypes.string,
  /** optional. allows renaming labels from internal paths to some other string */
  relabel: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
}

export { EditProperty }
