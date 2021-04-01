import React from 'react'

import { IconButton } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'

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
