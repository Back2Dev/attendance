import React from 'react'
import SplitPane from 'react-split-pane'
import { EditorPanel } from './editorPanel'
import { PreviewPanel } from './previewPanel'

export const Framework = () => {
  return (
    <SplitPane split="vertical" defaultSize="50%">
      <EditorPanel />
      <PreviewPanel />
    </SplitPane>
  )
}
