import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'
import { isPlainObject } from 'lodash'
import { editInspectorState } from '/imports/ui/forms/survey-builder/recoil/atoms'
import debug from 'debug'
import { TextField } from '@material-ui/core'
import { PropertyCard } from './edit-property-card'
import { InlineEdit } from '/imports/ui/forms/survey-builder/components/core/inline-edit'

const log = debug('builder:edit-property')

const questionOptions = [
  { label: 'Optional', value: 'optional' },
  { label: 'Placeholder', value: 'placeholder' },
  { label: 'Conditional', value: 'cond' },
  { label: 'Paragraphs', value: 'p' },
  { label: 'Headers', value: 'h3' },
  { label: 'Skip', value: 'skip' },
]

const answerOptions = [
  { label: 'Value', value: 'val' },
  { label: 'Placeholder', value: 'placeholder' },
  { label: 'Score', value: 'score' },
  { label: 'Specify', value: 'specify' },
]

export const QuestionProperty = ({ pid }) => {
  return (
    <PropertyCard pid={pid} addOptions={questionOptions}>
      {/* {children} */}
    </PropertyCard>
  )
}

export const PropertyField = ({ relabel, path, pid, placeholder = 'Value' }) => {
  const [property, setProperty] = useRecoilState(editInspectorState({ pid, path }))

  let label
  if (typeof relabel === 'string') {
    label = relabel
  } else if (typeof relabel === 'function') {
    label = relabel(path)
  } else {
    label = path.slice(path.lastIndexOf('.') + 1)
  }
  // const style = { display: checked.includes(path) ? 'block' : 'none' }
  return (
    <div style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>
      <InlineEdit
        label={label}
        text={property}
        placeholder={placeholder}
        onTextChange={(value) => setProperty(value)}
      />
    </div>
  )
}

const EditProperty = ({ pid, path, relabel, checked = [] }) => {
  // TODO convert into recoil hook
  const [property] = useRecoilState(editInspectorState({ pid, path }))

  const showField = answerOptions.find((item) => path.endsWith(item.value))
  //should be string...need fix
  if (typeof property === 'string' || property === true) {
    if (showField) return <PropertyField pid={pid} path={path} relabel={relabel} />
    else return null
  } else if (Array.isArray(property)) {
    const children = property.map((_, i) => {
      return createElement(EditProperty, { key: i, pid, path: `${path}[${i}]`, relabel })
    })
    return <>{children}</>
  } else if (isPlainObject(property)) {
    const children = Object.keys(property).map((key, j) => {
      return createElement(EditProperty, {
        key: j,
        pid,
        path: path ? `${path}.${key}` : key,
        relabel,
        checked,
      })
    })

    return (
      <PropertyCard
        children={children}
        // property={property}
        pid={pid}
        path={path}
        relabel={relabel}
        addOptions={answerOptions}
      />
    )
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
