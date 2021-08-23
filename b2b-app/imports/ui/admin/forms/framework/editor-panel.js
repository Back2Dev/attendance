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
import CM from 'codemirror'

// Codemirror linting will not work without this, see <https://github.com/scniro/react-codemirror2/issues/21>
window.JSHINT = JSHINT

import './resizer.css'
import SplitPane from 'react-split-pane'

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

  const [splitSize, setSplitSize] = React.useState('85%')
  const [timeoutId, setTimeoutId] = React.useState(null)

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

  const debounce = (callback, wait = 3000) => {
    return (...args) => {
      window.clearTimeout(timeoutId)
      setTimeoutId(
        window.setTimeout(() => {
          callback.apply(null, args)
        }, wait)
      )
    }
  }

  const handleEditorInput = React.useCallback(
    debounce(() => {
      if (formContext.autoRun && formContext.tab === 0) {
        formContext.compileForm()
      }
      formContext.save(false, true)
    })
  )

  return (
    <SplitPane
      split="horizontal"
      onChange={resize}
      size={splitSize}
      pane2Style={{ backgroundColor: '#192125' }}
    >
      <div className="container">
        <CodeMirror
          value={formContext.editors[formContext.tab].editorValue}
          options={{
            ...codemirrorOptions,
            mode: formContext.editors[formContext.tab].editorType,
          }}
          onBeforeChange={(editor, data, value) => {
            formContext.editors[formContext.tab].updateEditor(value)
          }}
          onChange={handleEditorInput}
          ref={codemirrorRef}
          editorDidMount={(editor) => {
            formContext.setEditorDoc(editor)
            CM.commands.save = () => formContext.save(false)
          }}
        />
      </div>
      <ErrorPanel />
    </SplitPane>
  )
}
