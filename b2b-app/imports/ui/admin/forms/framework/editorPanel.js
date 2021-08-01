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
  const [splitSize, setSplitSize] = React.useState('85%')

  const handleTabChange = (e, index) => {
    setTab(index)
  }

  const codemirrorRef = React.useRef()

  // Set height of codemirror
  React.useEffect(() => {
    const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
      .clientHeight
    console.log(height)
    // eslint-disable-next-line no-unused-vars
    const current = (codemirrorRef.current.editor.display.wrapper.style.height = `${
      height - 48
    }px`)
  })

  // Resize the codemirror components height when the split is changed
  const resize = (size) => {
    const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
      .clientHeight
    console.log(height)
    // eslint-disable-next-line no-unused-vars
    const current = (codemirrorRef.current.editor.display.wrapper.style.height = `${
      height - 48
    }px`)
    setSplitSize(size)
  }

  // when window resizes, change the split size to avoid the error panel moving offscreen
  React.useEffect(() => {
    window.addEventListener('resize', () => {
      setSplitSize('85%')
      const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
        .clientHeight
      console.log(height)
      // eslint-disable-next-line no-unused-vars
      const current = (codemirrorRef.current.editor.display.wrapper.style.height = `${
        height - 48
      }px`)
    })

    return () => window.removeEventListener('resize', () => setSplitSize('85%'))
  })

  return (
    <SplitPane split="horizontal" onChange={resize} size={splitSize}>
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
