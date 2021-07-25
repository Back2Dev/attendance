import React from 'react'
import { EditorContext } from './framework'

export const PreviewPanel = () => {
  const formContext = React.useContext(EditorContext)

  return <p>{formContext.editors[0].editorValue}</p>
}
