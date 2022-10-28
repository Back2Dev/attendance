import React from 'react'

// cm 6
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'

//
import './resizer.css'
import SplitPane from 'react-split-pane'

import { EditorContext } from './framework'
import { ErrorPanel } from './error-panel'

export const EditorPanel = ({ editor }) => {
  const formContext = React.useContext(EditorContext)

  const [splitSize, setSplitSize] = React.useState('85%')
  const [timeoutId, setTimeoutId] = React.useState(null)

  // const codemirrorRef = React.useRef()

  // if (editor.name === 'form') codemirrorOptions.lint = false

  // React.useEffect(() => {
  //   reapplyFolds(codemirrorRef.current.editor)
  // }, [editor.name])

  // // Set height of codemirror
  // React.useEffect(() => {
  //   if (editor.editorType === 'form') {
  //     const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
  //       .clientHeight
  //     // eslint-disable-next-line no-unused-vars
  //     const current =
  //       (codemirrorRef.current.editor.display.wrapper.style.height = `${height}px`)
  //   } else {
  //     const height =
  //       document.getElementsByClassName('Pane vertical Pane1')[0].clientHeight
  //     // eslint-disable-next-line no-unused-vars
  //     const current =
  //       (codemirrorRef.current.editor.display.wrapper.style.height = `${height}px`)
  //   }
  // })

  // Resize the codemirror components height when the split is changed
  const resize = (size) => {
    const height = document.getElementsByClassName('Pane horizontal Pane1')[0]
      .clientHeight
    // eslint-disable-next-line no-unused-vars
    const current =
      (codemirrorRef.current.editor.display.wrapper.style.height = `${height}px`)
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
        const current =
          (codemirrorRef.current.editor.display.wrapper.style.height = `${height}px`)
      }
    })

    return () => window.removeEventListener('resize', () => setSplitSize('85%'))
  })

  const reapplyFolds = (e) => {
    const lines = e.lastLine()

    for (let i = lines - 1; i >= 0; i--) {
      if (formContext.folds[editor.name][i]) {
        if (
          (e.isFolded(CM.Pos(i)) ? true : false) !== formContext.folds[editor.name][i]
        ) {
          e.foldCode(CM.Pos(i))
        }
      }
    }
    console.log('applied')
  }

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

  React.useEffect(()=> {
    //editor state
    const editorState = EditorState.create({
      extensions: [
        keymap.of([
          ...defaultKeymap, 
          ...[indentWithTab], 
        ]),
      ]
    });

    //editor view  
    const editorView = new EditorView({
      state: editorState,
      doc: editor.editorValue,
      parent: cmEditor.current,
    })

    return() =>{
      editorView.destroy();
    }
  },[]);

  const cmEditor = React.useRef()

  const codemirrorWindow = (
    <div className="container">
      <div ref={cmEditor}></div>
    </div>
  )

  const getEditor = () => {
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
