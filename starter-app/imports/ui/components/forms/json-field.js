import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { useCodeJar, ReactCodeJar } from 'react-codejar'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'

const debug = require('debug')('b2b:edit')

const codeHighlight = (editor) => {
  const text = editor.textContent

  editor.innerHTML = Prism.highlight(text, Prism.languages.javascript, 'json')
}

const Edit = ({ value, label, onChange }) => {
  const setCode = (val) => {
    try {
      debug(`onChange`, JSON.parse(val))
      onChange(JSON.parse(val))
    } catch (err) {
      // Malformed JSON is ok while typing
    }
  }

  return (
    <TextField
      style={{ width: '100%' }}
      multiline
      label={label}
      value={value}
      onChange={onChange}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent: ReactCodeJar,
        inputProps: {
          highlight: codeHighlight,
          onUpdate: setCode,
          style: { width: '100%' },
          code: JSON.stringify(value, null, 2),
        },
      }}
    />
  )
}

Edit.propTypes = {
  value: PropTypes.object.isRequired,
}
export default Edit
