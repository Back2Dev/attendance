import React from 'react'
import { Box } from '@material-ui/core'
import Canvas from './canvas'
import Parts from './parts'
import Inspector from './inspector/inspector'
import Toolbar from './toolbar'

const Builder = () => {
  return (
    <Box>
      <Toolbar />
      <Parts />
      <Canvas />
      <Inspector />
    </Box>
  )
}

export default Builder
