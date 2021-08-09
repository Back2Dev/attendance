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
  const [errors, setErrors] = React.useState(
    JSON.stringify(parse(formEditorInput).errs, null, 2)
  )
  const [autoRun, setAutoRun] = React.useState(false)

  // Function to update state of editor input, i.e. stores input form syntax
  const updateFormInput = (input) => {
    setFormEditorInput(input)
  }

  const compileForm = () => {
    const compiled = parse(formEditorInput)

    if (compiled.status === 'success') {
      setJsonEditorInput(JSON.stringify(compiled.survey, null, 2))
      setErrors(compiled.errs)
    } else {
      setErrors(compiled.errs)
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
