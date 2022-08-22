import React, { useContext } from 'react'
import { Checkbox } from '@material-ui/core'
import styled from 'styled-components'
import { CollectionContext } from '../../context'

const StyledCheckbox = styled(Checkbox)`
  padding: 0;
  color: #4794fc !important;
`

const BooleanFormater = ({ column, row }) => {
  const { updateCell } = useContext(CollectionContext)

  if (row[column?.key] === undefined) {
    return null
  }

  return (
    <StyledCheckbox
      checked={row[column.key]}
      onChange={(event) => {
        console.log(event.target.checked)
        updateCell({
          rowId: row._id,
          column: column.key,
          value: event.target.checked,
        })
      }}
    />
  )
}

export default BooleanFormater
