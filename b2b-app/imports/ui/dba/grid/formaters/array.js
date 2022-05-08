import React from 'react'
import Chip from '@material-ui/core/Chip'
import styled from 'styled-components'

const StyledChip = styled(Chip)`
  height: 28px;
  margin-right: 5px;
`

const ArrayFormater = ({ column, row }) => {
  if (!row[column.key] || !row[column.key].length) {
    return null
  }
  if (typeof row[column.key] !== 'object' || !row[column.key].length) {
    return JSON.stringify(row[column.key], null, 2)
  }
  return row[column.key].map((item) => {
    const label = typeof item === 'string' ? item : JSON.stringify(item)
    return <StyledChip key={label} label={label} />
  })
}

export default ArrayFormater
