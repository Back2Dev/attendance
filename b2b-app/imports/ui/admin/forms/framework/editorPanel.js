import React from 'react'

import { Controlled as CodeMirror } from 'react-codemirror2'
import { EditorContext } from './framework'

require('codemirror/lib/codemirror.css')
require('codemirror/theme/dracula.css')
require('codemirror/theme/panda-syntax.css')
require('codemirror/theme/material.css')
import './resizer.css'

const codemirrorOptions = {
  autoCloseBrackets: true,
  cursorScrollMargin: 48,
  mode: 'null',
  lineNumbers: true,
  indentUnit: 2,
  tabSize: 2,
  styleActiveLine: true,
  viewportMargin: 99,
  theme: 'material',
}

export const EditorPanel = () => {
  const formContext = React.useContext(EditorContext)

  return (
    <CodeMirror
      value={formContext.formEditorValue}
      options={codemirrorOptions}
      onBeforeChange={(editor, data, value) => {
        formContext.updateFormData(value)
      }}
    />
  )
}
