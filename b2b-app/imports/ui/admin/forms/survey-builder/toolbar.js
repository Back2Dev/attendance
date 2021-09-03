import { Box } from '@material-ui/core'
import React from 'react'
import { atom, useRecoilCallback, useRecoilState } from 'recoil'
import debug from 'debug'

import { parse } from '/imports/api/forms/engine.js'
import { typesMap } from './types'
import { partsAtom } from './recoil/atoms'

let log = debug('builder:toolbar')

const Status = ({ msg }) => {
  return <div>{msg}</div>
}

export const statusState = atom({
  key: 'status',
  default: null,
})

const Toolbar = () => {
  const [status, setStatus] = useRecoilState(statusState)
  const getSource = useRecoilCallback(
    ({ snapshot }) => () => {
      const parts = snapshot.getLoadable(partsAtom).contents
      const source = parts
        .map(
          ({ _id: pid, type }) =>
            snapshot.getLoadable(typesMap(type).sourceState(pid)).contents
        )
        .join('\n\n')
      return source
    },
    []
  )

  const save = () => {
    try {
      const source = getSource()
      if (!source) {
        setStatus('Nothing to save')
        return
      }
      const compiled = parse(source)
      if (compiled.status !== 'success') {
        throw new Error(compiled.errs)
      }
      // TODO send source and json to server
      log(source)
      log(compiled.survey)
      setStatus(`Last saved: ${new Date()}`)
    } catch (e) {
      setStatus(`Unable to generate source: ${e.message}`)
    }
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
      alignItems="center"
    >
      <button onClick={save}>Save</button>
      <Status msg={status} />
    </Box>
  )
}

export default Toolbar
