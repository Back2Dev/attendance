import { Box } from '@material-ui/core'
import React from 'react'
import { useRecoilCallback } from 'recoil'
import debug from 'debug'

import { partsState } from './canvas'
import { typesMap } from './types'

let log = debug('builder:toolbar')

const Toolbar = () => {
  const getSource = useRecoilCallback(
    ({ snapshot }) => () => {
      const parts = snapshot.getLoadable(partsState).contents
      // TODO create source from parts
      const source = parts
        .map(({ _id: pid, type }) => {
          const source = snapshot.getLoadable(typesMap(type).sourceState(pid)).contents
          return source
        })
        .join('\n')
      log(source)
    },
    []
  )

  const save = () => {
    const source = getSource()
    // TODO runs parser on source to get compiled.survey. We can convert to JSON from there
  }

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      height={40}
      border="1px solid lightgrey"
      display="flex"
      flexDirection="row-reverse"
      alignItems="center"
    >
      <button onClick={save}>Save</button>
    </Box>
  )
}

export default Toolbar
