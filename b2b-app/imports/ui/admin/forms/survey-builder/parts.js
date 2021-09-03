import React from 'react'

import { Box } from '@material-ui/core'
import DebugProps from './inspector/debug-props'
import debug from 'debug'
import { useParts } from './recoil/hooks'
const log = debug('builder:parts')

const Parts = () => {
  const { addPart } = useParts()
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      width="20%"
      border="1px solid lightgrey"
    >
      <button onClick={() => addPart('single')}>Single</button>
      <DebugProps />
    </Box>
  )
}

export default Parts
