import React from 'react'

import { IconButton } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

const MuiTicker = (props) => {
  const { row, column, onRowChange } = props

  return (
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation()
        onRowChange({ ...row, [column.key]: !row[column.key] })
      }}
    >
      {row[column.key] ? <CheckIcon color="primary" /> : <CloseIcon color="secondary" />}
    </IconButton>
  )
}

export default MuiTicker
