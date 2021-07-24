import React from 'react'
import { EditorContext } from './framework'

export const PreviewPanel = () => {
  const formContext = React.useContext(EditorContext)

  return <p>{formContext.formEditorValue}</p>
}
