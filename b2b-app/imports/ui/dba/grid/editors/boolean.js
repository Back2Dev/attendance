import React from 'react'
import styled from 'styled-components'
import { Checkbox } from '@material-ui/core'
import PropTypes from 'prop-types'
import { useContext } from 'react'
import { CollectionContext } from '../../context'

const StyledBooleanField = styled(Checkbox)`
  padding: 0;
  margin-left: 8px;
`

function BooleanField(props) {
  // console.log('BooleanField', props)
  const { updateCell } = useContext(CollectionContext)
  const { row, column, onClose } = props
  const value = row[column.key]
  return (
    <StyledBooleanField
      checked={value === true}
      onChange={(event) => {
        console.log(event.target.checked)
        // onRowChange({ ...row, [column.key]: event.target.checked })
        updateCell({
          rowId: row._id,
          column: column.key,
          value: event.target.checked,
          cb: (result) => {
            if (result.status === 'success') {
              onClose()
            }
          },
        })
      }}
    />
  )
}

BooleanField.propTypes = {
  column: PropTypes.object,
  onRowChange: PropTypes.func,
  onClose: PropTypes.func,
  row: PropTypes.object,
  rowIdx: PropTypes.number,
}

export default BooleanField
