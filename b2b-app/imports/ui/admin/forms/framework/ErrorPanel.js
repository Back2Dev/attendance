import React from 'react'
import { EditorContext } from './framework'
import './resizer.css'

export const ErrorPanel = () => {
  const formContext = React.useContext(EditorContext)

  return (
    <div className="errorContainer">
      <h1 style={{ color: 'white', margin: 0 }}>Errors</h1>
    </div>
  )
}
