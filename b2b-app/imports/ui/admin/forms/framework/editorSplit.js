import React from 'react'
import SplitPane from 'react-split-pane'
import { EditorPanel } from './editorPanel'
import { PreviewPanel } from './previewPanel'

export const EditorSplit = () => {
  return (
    <SplitPane split="horizontal" defaultSize="50%" primary="second">
      <EditorPanel />
      <div>
        <h1>Hello world</h1>
      </div>
    </SplitPane>
  )
}
