import React from 'react'

import { Controlled as CodeMirror } from 'react-codemirror2'
import { EditorContext } from './framework'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

require('codemirror/lib/codemirror.css')
require('codemirror/theme/dracula.css')
require('codemirror/theme/panda-syntax.css')
require('codemirror/theme/material.css')
require('codemirror/mode/javascript/javascript')
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

  const [tab, setTab] = React.useState(0)

  const handleTabChange = (e, index) => {
    setTab(index)
  }

  return (
    <div>
      <Paper square>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          aria-label="disabled tabs example"
        >
          <Tab label="details.form" />
          <Tab label="detailsForm.json" />
        </Tabs>
      </Paper>

      <CodeMirror
        value={formContext.editors[tab].editorValue}
        options={{ ...codemirrorOptions, mode: formContext.editors[tab].editorType }}
        onBeforeChange={(editor, data, value) => {
          formContext.editors[tab].updateEditor(value)
        }}
      />
    </div>
  )
}
