import React from 'react'
import { useHistory } from 'react-router-dom'
import SplitPane from 'react-split-pane'
import { EditorPanel } from './editor-panel'
import { PreviewPanel } from './preview-panel'

import { parse } from '/imports/api/forms/engine.js'

export const EditorContext = React.createContext()

const Framework = ({ id, item, methods }) => {
  const save = (quit) => {
    try {
      methods.update(id, { _id: id, source: formEditorInput }, quit)
    } catch (e) {
      alert(`Update error ${e.message}`)
    }
  }

  const { goBack } = useHistory()
  const back = () => {
    goBack()
  }
  // State of the form editor, exposed in the EditorContext
  const [formEditorInput, setFormEditorInput] = React.useState(item.source)

  const [jsonEditorInput, setJsonEditorInput] = React.useState('')
  const [errors, setErrors] = React.useState(parse(formEditorInput).errs)
  const [autoRun, setAutoRun] = React.useState(false)
  //codemirror references
  const [editor, setEditor] = React.useState()
  const [doc, setDoc] = React.useState()
  //error widgets
  const [widgets, setWidgets] = React.useState([])

  // Function to update state of editor input, i.e. stores input form syntax
  const updateFormInput = (input) => {
    setFormEditorInput(input)
  }

  const compileForm = () => {
    const compiled = parse(formEditorInput)

    if (compiled.status === 'success') {
      setJsonEditorInput(JSON.stringify(compiled.survey, null, 2))
      setErrors(compiled.errs)
      showErrors(compiled.errs)
    } else {
      setErrors(compiled.errs)
      showErrors(compiled.errs)
    }
  }

  // Function to update state of editor input, i.e. stores input form syntax
  const updateJsonInput = (input) => {
    setJsonEditorInput(input)

    // parse input here?
  }

  const toggleAutoRun = () => {
    setAutoRun(autoRun ? false : true)
  }

  const showErrors = (errors) => {
    hideErrors()
    setWidgets([])

    if (errors === 'No Errors') return

    const newWidgets = []

    for (let i = 0; i < errors.length; i++) {
      const error = errors[i]
      const msg = document.createElement('div')
      const icon = msg.appendChild(document.createElement('span'))
      icon.innerHTML = '!!'
      icon.className = 'lint-error-icon'
      msg.appendChild(document.createTextNode(error.error))
      msg.className = 'lint-error'
      console.log(error)
      newWidgets.push(doc.addLineWidget(error.lineno - 1, msg))
    }
    setWidgets(newWidgets)
  }

  const hideErrors = () => {
    for (var i = 0; i < widgets.length; ++i) editor.removeLineWidget(widgets[i])
  }

  return (
    <EditorContext.Provider
      value={{
        editors: [
          {
            name: 'details.form',
            editorValue: formEditorInput,
            updateEditor: updateFormInput,
            editorType: 'null',
          },
          {
            name: 'detailsForm.json',
            editorValue: jsonEditorInput,
            updateEditor: updateJsonInput,
            editorType: { name: 'javascript', json: true },
          },
        ],
        errors: errors ? errors : 'No Errors',
        save,
        autoRun,
        toggleAutoRun,
        compileForm,
        editor,
        doc,
        setEditorDoc: (editor) => {
          setEditor(editor)
          setDoc(editor.getDoc())
        },
        hideErrors,
        showErrors,
      }}
    >
      <SplitPane split="vertical" defaultSize="50%">
        <EditorPanel />
        <PreviewPanel />
      </SplitPane>
    </EditorContext.Provider>
  )
}

export default Framework
