import React from 'react'

import { useListControls } from './hooks'
import { Box } from '@material-ui/core'
import { makeNewItem } from './hooks/list-controls'
import { partsState } from './canvas'
import DebugProps from './inspector/debug-props'
import debug from 'debug'
const log = debug('builder:parts')

const Parts = () => {
  const { add } = useListControls(partsState)

  return (
    <Box
      position="absolute"
      top={40}
      left={0}
      bottom={0}
      width="20%"
      border="1px solid lightgrey"
    >
      <button onClick={() => add(makeNewItem({ type: 'single' }))}>Single</button>
      <DebugProps />
    </Box>
  )
}

export default Parts
