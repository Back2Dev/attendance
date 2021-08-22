import React from 'react'
import { useListControls } from './hooks'
import { Box } from '@material-ui/core'
import { makeNewItem } from './hooks/list-controls'
import { partsState } from './canvas'

const Parts = () => {
  const { add } = useListControls(partsState)

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      width="10%"
      border="1px solid lightgrey"
    >
      <button onClick={() => add(makeNewItem())}>Single</button>
    </Box>
  )
}

export default Parts
