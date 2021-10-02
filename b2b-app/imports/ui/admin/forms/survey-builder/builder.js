import React, { useContext } from 'react'
import { Box } from '@material-ui/core'
import PropTypes from 'prop-types'
import debug from 'debug'
import NavigationController from 'react-navigation-controller'
import styled from 'styled-components'

import Parts from './parts'
import Inspector from './inspector/inspector'
import Toolbar, { statusState } from './toolbar'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { BuilderProvider, useBuilder, DndProvider } from './context'
import dataCache from './data-cache'
import { EditorContext } from '../framework/framework'
import Canvas from './canvas'
import { RecoilDevtools } from './utils'
import { BuilderView } from './views/builder'

const log = debug('builder:builder')

const NavController = styled(NavigationController)({
  position: 'relative',
  minHeight: '100vh',
  overflow: 'hidden',
  '.ReactNavigationControllerView': {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
  },
})

export const PureBuilder = ({ json }) => {
  const setStatus = useSetRecoilState(statusState)
  const { isMobile } = useBuilder()
  try {
    dataCache.set(json)
  } catch (e) {
    setStatus(`Unable to load data: ${e.message}`)
    dataCache.set(null)
  }

  if (isMobile) {
    return <NavController views={[<BuilderView />]} />
  }

  return (
    <Box height="calc(100vh - 64px - 48px)">
      <Toolbar />
      <Box position="relative" height="calc(100% - 40px)">
        <Parts />
        <Canvas />
        <Inspector />
      </Box>
    </Box>
  )
}

PureBuilder.propTypes = {
  json: PropTypes.object,
}

const Builder = () => {
  const editorCtx = useContext(EditorContext)
  return (
    <RecoilRoot>
      <RecoilDevtools />
      <BuilderProvider>
        <DndProvider>
          <PureBuilder json={JSON.parse(editorCtx.editors[1].editorValue)} />
        </DndProvider>
      </BuilderProvider>
    </RecoilRoot>
  )
}

export default Builder
