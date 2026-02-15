import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { AutoField, HiddenField, TextField } from 'uniforms-mui'
import { ErrorField } from 'uniforms-mui'

import dbg from 'debug'
const debug = dbg('app:dpa-serial')

/**
 *
 *
 */
const Serial = (q, ix, model, formData) => {
  const { id, name } = q

  return (
    <div>
      <Box component={Paper} key="1">
        <AutoField id="brand" name="brand" defaultValue="" label={'Brand'} />
        <AutoField id="serial" name="serial" defaultValue="" label={'Serial No'} />
      </Box>
    </div>
  )
}

export default Serial
