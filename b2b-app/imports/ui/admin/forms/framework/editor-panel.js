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
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/mode/simple.js'
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
  mode: 'form',
  lineNumbers: true,
  indentUnit: 2,
  tabSize: 2,
  styleActiveLine: true,
  viewportMargin: 99,
  theme: 'material',
  lint: true,
  foldGutter: true,
  gutters: ['CodeMirror-lint-markers', 'CodeMirror-foldgutter'],
}

export const EditorPanel = ({ editor }) => {
  const formContext = React.useContext(EditorContext)

  const [splitSize, setSplitSize] = React.useState('85%')
  const [timeoutId, setTimeoutId] = React.useState(null)

  const codemirrorRef = React.useRef()

  // Modified from https://codemirror.net/addon/fold/markdown-fold.js
  // Registers a 'rangeFunction' for the fold add on, to define code folding of sections for the form schema
  CM.registerHelper('fold', 'form', function (cm, start) {
    // get the 'level' of a line. If the line doesnt define a foldable section, the level is -1
    function getLevel(line) {
      if (line.match(/^S/)) {
        return 1
      } else if (line.match(/^Q/)) {
        return 2
      } else if (line.match(/^A/)) {
        return 3
      }
      return -1
    }

    var firstLine = cm.getLine(start.line),
      nextLine = cm.getLine(start.line + 1)

    const startLevel = getLevel(firstLine)
    // If the line doesnt define a section, question or answer, dont try and find an end point for a fold
    if (startLevel === -1) return undefined

    // Find the endpoint of the fold
    var lastLineNo = cm.lastLine()
    var end = start.line,
      nextNextLine = cm.getLine(end + 2)

    while (end < lastLineNo) {
      // The end of the fold is found if the line is a section, question or answer (i.e. not level -1) with a level lower or equal to the start of the fold
      // i.e. a fold of a question ends at a section but not an answer
      if (getLevel(nextLine) !== -1 && getLevel(nextLine) <= startLevel) break
      ++end
      nextLine = nextNextLine
      nextNextLine = cm.getLine(end + 2)
    }

    // leave space between folds if available
    if (cm.getLine(end).trim() === '') end--

    // Dont show folding for single line folds
    if (end - start.line <= 1) return undefined

    return {
      from: CM.Pos(start.line, firstLine.length),
      to: CM.Pos(end, cm.getLine(end).length),
    }
  })

  // Create a new mode for the form schema, to add code folding.
  // See https://codemirror.net/demo/simplemode.html to get started on actually defining
  CM.defineSimpleMode('form', {
    start: [{ regex: /./, token: 'string' }],
  })

  // Set height of codemirror
  React.useEffect(() => {
    if (editor.editorType === 'form') {
      const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
        .clientHeight
      // eslint-disable-next-line no-unused-vars
      const current = (codemirrorRef.current.editor.display.wrapper.style.height = `${height}px`)
    } else {
      const height = document.getElementsByClassName('Pane vertical Pane1')[0]
        .clientHeight
      // eslint-disable-next-line no-unused-vars
      const current = (codemirrorRef.current.editor.display.wrapper.style.height = `${height}px`)
    }
  })

  // Resize the codemirror components height when the split is changed
  const resize = (size) => {
    const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
      .clientHeight
    // eslint-disable-next-line no-unused-vars
    const current = (codemirrorRef.current.editor.display.wrapper.style.height = `${height}px`)
    setSplitSize(size)
  }

  // when window resizes, change the split size to avoid the error panel moving offscreen
  React.useEffect(() => {
    window.addEventListener('resize', () => {
      setSplitSize('85%')
      const pane = document.getElementsByClassName(
        editor.editorType === 'form' ? 'Pane horizontal Pane1' : 'Pane vertical Pane1'
      )[0]
      if (pane) {
        const height = document.getElementsByClassName(
          editor.editorType === 'form' ? 'Pane horizontal Pane1' : 'Pane vertical Pane1'
        )[0].clientHeight
        // eslint-disable-next-line no-unused-vars
        const current = (codemirrorRef.current.editor.display.wrapper.style.height = `${height}px`)
      }
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
      if (formContext.autoRun) {
        formContext.compileForm()
      }
      if (formContext.autoSave) {
        formContext.save(false, true)
      }
    })
  )

  const getEditor = () => {
    const codemirrorWindow = (
      <div className="container">
        <CodeMirror
          value={editor.editorValue}
          options={{
            ...codemirrorOptions,
            mode: editor.editorType,
          }}
          onBeforeChange={(e, data, value) => {
            editor.updateEditor(value)
          }}
          onChange={handleEditorInput}
          ref={codemirrorRef}
          editorDidMount={(editor) => {
            formContext.setEditorDoc(editor)
            CM.commands.save = () => formContext.save(false)
          }}
        />
      </div>
    )
    if (editor.editorType === 'form') {
      return (
        <SplitPane
          split="horizontal"
          onChange={resize}
          size={splitSize}
          pane2Style={{ backgroundColor: '#192125' }}
        >
          {codemirrorWindow}
          <ErrorPanel />
        </SplitPane>
      )
    }

    return codemirrorWindow
  }

  return getEditor()
}
