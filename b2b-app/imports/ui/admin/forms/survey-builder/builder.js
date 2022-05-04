import React, { useContext } from 'react'
import { RecoilRoot } from 'recoil'
import { BuilderProvider, DndProvider } from '$sb/context'
import { EditorContext } from '../framework/framework'
import { RecoilDevtools } from '$sb/utils'
import { BuilderView } from './views'

const debug = require('debug')('app:builder')
const blankForm = require('./blank-form.json')

const Builder = () => {
  const editorCtx = useContext(EditorContext)
  let json = blankForm
  try {
    json = JSON.parse(editorCtx.editors[1].editorValue)
  } catch (e) {
    debug(`Error parsing json: ${e.message}`)
  }
  return (
    <RecoilRoot>
      <RecoilDevtools />
      <BuilderProvider>
        <DndProvider>
          <BuilderView json={json} />
        </DndProvider>
      </BuilderProvider>
    </RecoilRoot>
  )
}

export { Builder }
