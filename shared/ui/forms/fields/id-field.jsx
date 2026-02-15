import { Random } from 'meteor/random'
import React, { useState } from 'react'
import { connectField } from 'uniforms'
// import { HiddenField } from 'uniforms-mui'
import TextField from '@mui/material/TextField'
import { randomId } from '/imports/api/utils/misc'

const IdField = ({ id, onChange, name, value }) => {
  console.log({
    id,
    name,
    value,
  })
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const r = value || Random.id() // randomId(17)
  if (!value) onChange(r)
  return (
    <>
      {/* <span title={r} style={{ color: 'white' }}>
        {r}
      </span> */}
      <input
        name={name}
        id={id}
        type="hidden"
        value={r}
        onChange={(value) => onChange(value)}
      />
    </>
  )
}

export default connectField(IdField, { kind: 'leaf' })

// export default HiddenField
// export default IdField
