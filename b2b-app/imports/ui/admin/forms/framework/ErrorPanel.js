import React from 'react'
import { EditorContext } from './framework'
import './resizer.css'

export const ErrorPanel = () => {
  const formContext = React.useContext(EditorContext)

  return <div className="errorContainer">{formContext.errors}</div>
}
