import React from 'react'
import { Checkbox } from '@material-ui/core'
import styled from 'styled-components'

const StyledCheckbox = styled(Checkbox)`
  padding: 0;
`

const BooleanFormater = ({ column, row }) => {
  if (row[column?.key] === undefined) {
    return null
  }

  return <StyledCheckbox checked={row[column.key]} disabled />
}

export default BooleanFormater
