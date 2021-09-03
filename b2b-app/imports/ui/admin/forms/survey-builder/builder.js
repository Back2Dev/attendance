import React, { useContext } from 'react'
import { Box } from '@material-ui/core'
import PropTypes from 'prop-types'
import debug from 'debug'

import Canvas from './canvas'
import Parts from './parts'
import Inspector from './inspector/inspector'
import Toolbar, { statusState } from './toolbar'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import DndProvider from './context/dnd'
import dataCache from './data-cache'
// FIXME enabling context causes storybook to blow up with EditorPanel error
// import { EditorContext } from '../framework/framework'

const log = debug('builder:builder')

export const PureBuilder = ({ json }) => {
  const setStatus = useSetRecoilState(statusState)
  try {
    dataCache.set(json)
  } catch (e) {
    setStatus(`Unable to load data: ${e.message}`)
    dataCache.set(null)
  }
  return (
    <Box>
      <Toolbar />
      <Parts />
      <Canvas />
      <Inspector />
    </Box>
  )
}

PureBuilder.propTypes = {
  json: PropTypes.object,
}

const Builder = ({ json }) => {
  return (
    <RecoilRoot>
      <DndProvider>
        <PureBuilder json={json} />
      </DndProvider>
    </RecoilRoot>
  )
}

export default Builder
