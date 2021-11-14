import React, { useContext } from 'react'
import { atom, useRecoilCallback, useRecoilState } from 'recoil'
import { Box } from '@material-ui/core'
import debug from 'debug'

import { parse } from '/imports/api/forms/engine.js'
import { partsAtom } from '$sb/recoil/atoms'
import { EditorContext } from '$sb/../framework/framework'

let log = debug('builder:toolbar')

const Status = ({ msg }) => {
  return <div>{msg}</div>
}

const statusState = atom({
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
        .map(({ _id: pid, config }) => snapshot.getLoadable(config.source(pid)).contents)
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
    <Box display="flex">
      <button onClick={save}>Save</button>
      <Status msg={status} />
    </Box>
  )
}

export { Toolbar, statusState }
