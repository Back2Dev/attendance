import React, { createElement } from 'react'
import { atom, useSetRecoilState } from 'recoil'
import { Box } from '@material-ui/core'
import debug from 'debug'

import { useListControls } from './hooks'
import { typesMap } from './types'

const log = debug('builder:canvas')

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
      top={40}
      bottom={0}
      left="20%"
      right="20%"
      border="1px solid lightgrey"
      onClick={() => setSelectedPart(null)}
      overflow="auto"
    >
      {parts.map(({ _id, type }) => {
        return createElement(typesMap(type).component, { key: _id, pid: _id })
      })}
    </Box>
  )
}

export default Canvas
