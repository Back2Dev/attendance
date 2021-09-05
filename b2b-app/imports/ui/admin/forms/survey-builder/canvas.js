import React, { createElement } from 'react'
import { Box } from '@material-ui/core'
import debug from 'debug'

import { Placeholder } from './types'
import { usePartsValue, useSetSelectedPart } from './recoil/hooks'
import TypeRegistry from './types/type-registry'

const log = debug('builder:canvas')

const Canvas = () => {
  const parts = usePartsValue()
  const setSelectedPart = useSetSelectedPart()
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
      {parts.map(({ _id, type }) => {
        return createElement(TypeRegistry.get(type)?.component || Placeholder, {
          key: _id,
          pid: _id,
        })
      })}
    </Box>
  )
}

export default Canvas
