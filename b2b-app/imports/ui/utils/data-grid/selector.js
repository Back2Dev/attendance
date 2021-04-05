import React from 'react'

import { Select, MenuItem } from '@material-ui/core'

const MuiSelector = (props) => {
  const { row, column, onRowChange, options = [] } = props

  const renderOptions = () => {
    return options.map((option) => {
      const { text, value } = option
      return (
        <MenuItem key={value} value={value}>
          {text}
        </MenuItem>
      )
    })
  }

  return (
    <Select
      fullWidth
      value={row[column.key]}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        // console.log(e.target.value)
        onRowChange({ ...row, [column.key]: e.target.value })
      }}
      onBlur={() => console.log('onBlur')}
      style={{ minHeight: 30 }}
      MenuProps={{
        autoFocus: false,
      }}
    >
      {renderOptions()}
    </Select>
  )
}

export default MuiSelector
