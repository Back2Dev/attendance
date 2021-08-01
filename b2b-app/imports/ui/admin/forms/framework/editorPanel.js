import React from 'react'

import { Controlled as CodeMirror } from 'react-codemirror2'
import { EditorContext } from './framework'
import { ErrorPanel } from './errorPanel'

require('codemirror/lib/codemirror.css')
require('codemirror/theme/dracula.css')
require('codemirror/theme/panda-syntax.css')
require('codemirror/theme/material.css')
require('codemirror/mode/javascript/javascript')
import './resizer.css'
import SplitPane from 'react-split-pane'
import { EditorToolbar } from './editorToolbar'

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

  const codemirrorRef = React.useRef()

  React.useEffect(() => {
    const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
      .clientHeight
    console.log(height)
    // eslint-disable-next-line no-unused-vars
    const current = (codemirrorRef.current.editor.display.wrapper.style.height = `${
      height - 48
    }px`)
  })

  const resize = () => {
    const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
      .clientHeight
    console.log(height)
    // eslint-disable-next-line no-unused-vars
    const current = (codemirrorRef.current.editor.display.wrapper.style.height = `${
      height - 48
    }px`)
  }

  return (
    <SplitPane split="horizontal" defaultSize="85%" onChange={resize}>
      <div className="container">
        <EditorToolbar tab={tab} onTabChange={handleTabChange} />

        <CodeMirror
          value={formContext.editors[tab].editorValue}
          options={{ ...codemirrorOptions, mode: formContext.editors[tab].editorType }}
          onBeforeChange={(editor, data, value) => {
            formContext.editors[tab].updateEditor(value)
          }}
          ref={codemirrorRef}
        />
      </div>
      <ErrorPanel />
    </SplitPane>
  )
}
