import React from 'react'
import Editor from '@monaco-editor/react'
import { OutlinedInput, InputLabel, FormControl } from '@mui/material'
import { Box } from '@mui/material'
import { connectField } from 'uniforms'

const debug = require('debug')('app:form-monaco-field')

const MonaField = React.forwardRef(({ value = {}, label, onChange }, ref) => {
  return (
    <Box my="8px">
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <OutlinedInput
          ref={ref}
          style={{ paddingTop: 10 }}
          label={label}
          fullWidth
          value={value}
          inputProps={{
            onChange: (v) => {
              try {
                onChange(JSON.parse(v))
              } catch (e) {
                debug('Error parsing JSON', e.message)
              }
            },
            value,
          }}
          inputComponent={MonacoEditorContainer}
        />
      </FormControl>
    </Box>
  )
})

export default MonaField
// TODO: Something complains about this ref
const MonacoEditorContainer = React.forwardRef((props, ref) => {
  const { onChange, value } = props

  return (
    <Editor
      height={200}
      defaultLanguage="json"
      defaultValue={JSON.stringify(value, null, 2)}
      onChange={onChange}
      wrapperProps={{
        ref,
      }}
      options={{
        minimap: { enabled: false },
        wordWrap: 'on',
        lineNumbers: 'off',
        folding: false,
        renderLineHighlight: 'none',
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
      }}
    />
  )
})

export const ConnectedMonaField = connectField(MonaField, {
  initialValue: false,
})
