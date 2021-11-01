import React, { useContext } from 'react'
import debug from 'debug'

import { RecoilRoot } from 'recoil'
import { BuilderProvider, DndProvider } from '$sb/context'
import { EditorContext } from '../framework/framework'
import { RecoilDevtools } from '$sb/utils'
import { BuilderView } from './views'

const log = debug('builder:builder')

const Builder = () => {
  const editorCtx = useContext(EditorContext)

  return (
    <RecoilRoot>
      <RecoilDevtools />
      <BuilderProvider>
        <DndProvider>
          <BuilderView json={JSON.parse(editorCtx.editors[1].editorValue)} />
        </DndProvider>
      </BuilderProvider>
    </RecoilRoot>
  )
}

export { Builder }
