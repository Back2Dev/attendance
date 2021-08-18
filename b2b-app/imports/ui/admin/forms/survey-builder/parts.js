import React from 'react'
import { useListControls } from './hooks'
import { Box } from '@material-ui/core'

const Parts = () => {
  const { add } = useListControls('parts')

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      width="10%"
      border="1px solid lightgrey"
    >
      <button onClick={() => add('')}>Single</button>
    </Box>
  )
}

export default Parts
