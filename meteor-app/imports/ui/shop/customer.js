import React from 'react'
import { Chip } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

const CustomerMenuItem = props => {
  if (sessionStorage.getItem('name')) {
    return (
      <Chip
        color="info"
        icon={<PersonIcon />}
        label={sessionStorage.getItem('name')}
        sx={{ ml: 1 }}
      />
    )
  }

  return null
}

export default CustomerMenuItem

export const CustomerLabel = ({ name }) => {
  if (name) {
    return (
      <Chip variant="outlined" icon={<PersonIcon />} label={name} />
    )
  }

  return null
}
