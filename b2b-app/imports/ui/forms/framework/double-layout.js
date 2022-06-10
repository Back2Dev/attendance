import React from 'react'
import { EditorContext } from './framework'
import './resizer.css'

import SplitPane from 'react-split-pane'
import { EditorPanel } from './editor-panel'
import { PreviewPanel } from './preview-panel'

export const DoubleLayout = () => {
  const formContext = React.useContext(EditorContext)

  return (
    <SplitPane split="vertical" defaultSize="66%" primary="second">
      <EditorPanel editor={formContext.editors[0]} />
      <SplitPane split="vertical" defaultSize="50%">
        <EditorPanel editor={formContext.editors[1]} />
        <PreviewPanel />
      </SplitPane>
    </SplitPane>
  )
}
