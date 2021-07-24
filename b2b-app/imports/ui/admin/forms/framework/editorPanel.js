import React from 'react'

import { UnControlled as CodeMirror } from 'react-codemirror2'

require('codemirror/mode/xml/xml')
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/css/css')
require('codemirror/mode/jsx/jsx')
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
  const state = 'form syntax'

  return <CodeMirror value={state} options={codemirrorOptions} onChange={() => {}} />
}
