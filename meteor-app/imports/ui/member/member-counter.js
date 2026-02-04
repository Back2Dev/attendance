import React from 'react'
import { Chip } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

const MemberCounter = (props) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <Chip
        color="success"
        icon={<PersonIcon />}
        label={props.count}
        sx={{ fontSize: '1.25rem', px: 1, py: 2 }}
      />
    </div>
  )
}

export default MemberCounter
