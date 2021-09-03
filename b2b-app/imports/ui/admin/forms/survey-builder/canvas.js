import React, { createElement } from 'react'
import { Box } from '@material-ui/core'
import debug from 'debug'

import { typesMap } from './types'
import Placeholder from './types/placeholder'
import { usePartsValue, useSetSelectedPart } from './recoil/hooks'

const log = debug('builder:canvas')

const Canvas = () => {
  const parts = usePartsValue()
  const setSelectedPart = useSetSelectedPart()
  log(parts)
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
        return createElement(typesMap(type) ? typesMap(type).component : Placeholder, {
          key: _id,
          pid: _id,
        })
      })}
    </Box>
  )
}

export default Canvas
