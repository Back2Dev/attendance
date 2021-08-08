import React from 'react'
import { JSHINT } from 'jshint'

import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/panda-syntax.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/javascript-lint.js'
import 'codemirror/addon/hint/javascript-hint.js'

// Codemirror linting will not work without this, see <https://github.com/scniro/react-codemirror2/issues/21>
window.JSHINT = JSHINT

import './resizer.css'
import SplitPane from 'react-split-pane'

import { EditorToolbar } from './editor-toolbar'
import { EditorContext } from './framework'
import { ErrorPanel } from './error-panel'

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
  lint: true,
  gutters: ['CodeMirror-lint-markers'],
}

export const EditorPanel = () => {
  const formContext = React.useContext(EditorContext)

  const [tab, setTab] = React.useState(0)
  const [splitSize, setSplitSize] = React.useState('85%')
  const [editor, setEditor] = React.useState()

  const handleTabChange = (e, index) => {
    setTab(index)
  }

  const codemirrorRef = React.useRef()

  // Set height of codemirror
  React.useEffect(() => {
    const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
      .clientHeight
    // eslint-disable-next-line no-unused-vars
    const current = (codemirrorRef.current.editor.display.wrapper.style.height = `${
      height - 48
    }px`)
  })

  // Resize the codemirror components height when the split is changed
  const resize = (size) => {
    const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
      .clientHeight
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
          onChange={formContext.autoRun && tab === 0 ? formContext.compileForm : () => {}}
          // onChange={() => {
          //   // const msg = document.createElement('div')
          //   // const icon = msg.appendChild(document.createElement('span'))
          //   // icon.innerHTML = '!'
          //   // icon.className = 'lint-error-icon'
          //   // msg.appendChild(document.createTextNode('Error message'))
          //   // msg.className = 'lint-error'
          //   // editor.getDoc().addLineWidget(1, msg)
          // }}
          ref={codemirrorRef}
          editorDidMount={(editor) => {
            setEditor(editor)
          }}
        />
      </div>
      <ErrorPanel />
    </SplitPane>
  )
}
