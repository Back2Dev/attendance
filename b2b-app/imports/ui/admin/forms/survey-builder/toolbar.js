import { Box } from '@material-ui/core'
import React, { useContext } from 'react'
import { atom, useRecoilCallback, useRecoilState } from 'recoil'
import debug from 'debug'

import { parse } from '/imports/api/forms/engine.js'
import { partsAtom } from './recoil/atoms'
import TypeRegistry from './types/type-registry'
import { EditorContext } from '../framework/framework'
import { useBuilder } from './context'

let log = debug('builder:toolbar')

const Status = ({ msg }) => {
  return <div>{msg}</div>
}

export const statusState = atom({
  key: 'status',
  default: null,
})

const Toolbar = () => {
  const editorCtx = useContext(EditorContext)
  const [status, setStatus] = useRecoilState(statusState)
  const getSource = useRecoilCallback(
    ({ snapshot }) => () => {
      const parts = snapshot.getLoadable(partsAtom).contents
      const source = parts
        .map(
          ({ _id: pid, type }) =>
            snapshot.getLoadable(TypeRegistry.get(type).source(pid)).contents
        )
        .join('\n\n')
      return source
    },
    []
  )
  const { isMobile } = useBuilder()

  const save = () => {
    try {
      const source = getSource()
      if (!source) {
        setStatus('Nothing to save')
        return
      }
      const compiled = parse(source)
      if (compiled.status !== 'success') {
        throw new Error(`Source parser error: ${compiled.message}`)
      }
      // TODO send source and json to server
      log(source)
      log(compiled.survey)
      editorCtx.editors[0].updateEditor(source)
      setStatus(`Last saved: ${new Date()}`)
    } catch (e) {
      setStatus(`Unable to generate source: ${e.message}`)
    }
  }

  return (
    <Box
      height={40}
      flex="0 1 auto"
      border="1px solid lightgrey"
      display="flex"
      alignItems="center"
      mx={isMobile ? 1 : 0}
    >
      <Status msg={status} />
      <button onClick={save}>Save</button>
    </Box>
  )
}

export default Toolbar
