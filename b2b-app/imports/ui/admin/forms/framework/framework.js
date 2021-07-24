import React from 'react'
import SplitPane from 'react-split-pane'
import { EditorPanel } from './editorPanel'
import { PreviewPanel } from './previewPanel'

export const EditorContext = React.createContext()

export const Framework = () => {
  // State of the form editor, exposed in the EditorContext
  const [formEditorInput, setFormEditorInput] = React.useState('Hello world')

  // Function to update state of editor input, i.e. stores input form syntax
  const updateFormInput = (input) => {
    setFormEditorInput(input)

    // parse input here?
  }

  return (
    <EditorContext.Provider
      value={{
        formEditorValue: formEditorInput,
        updateFormData: updateFormInput,
      }}
    >
      <SplitPane split="vertical" defaultSize="50%">
        <EditorPanel />
        <PreviewPanel />
      </SplitPane>
    </EditorContext.Provider>
  )
}
