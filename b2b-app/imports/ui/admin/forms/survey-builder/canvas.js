import React from 'react'
import { atom, useSetRecoilState } from 'recoil'
import { Box } from '@material-ui/core'

import Single from './types/single'
import { useListControls } from './hooks'

export const selectedPartState = atom({
  key: 'selectedPart',
  default: null,
})

export const partsState = atom({
  key: 'parts',
  default: [],
})

const Canvas = () => {
  const { all: parts } = useListControls(partsState)
  const setSelectedPart = useSetRecoilState(selectedPartState)

  return (
    <Box
      position="absolute"
      top={0}
      bottom={0}
      left="20%"
      right="20%"
      border="1px solid lightgrey"
      onClick={() => setSelectedPart(null)}
      overflow="auto"
    >
      {parts.map(({ id }) => (
        <Single key={id} id={id} />
      ))}
    </Box>
  )
}

export default Canvas
