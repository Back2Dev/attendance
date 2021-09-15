import { TextEditor } from 'react-data-grid'
import PropTypes from 'prop-types'

import React, { useRef } from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'

const StyledCellEditor = styled.div``
const StyledNoEditor = styled.div`
  padding: 0 8px;
`

function CellEditor(props) {
  const { column, onClose, onRowChange, row, rowIdx } = props
  console.log('cell editor', { column, onClose, onRowChange, row, rowIdx })

  const rowData = useRef(row)

  const handleRowChange = (p) => {
    console.log('row change', p)
    rowData.current = p
    onRowChange(p)
  }

  const handleClose = (p) => {
    console.log('close', p)
    console.log('row data', rowData.current)
    onClose(p)
  }

  switch (column.type) {
    case 'String':
      return <TextEditor {...props} onRowChange={handleRowChange} onClose={handleClose} />
    default:
      // return the value, not handle this
      return <StyledNoEditor>{column.formatter({ row })}</StyledNoEditor>
  }
}

CellEditor.propTypes = {
  column: PropTypes.object,
  onClose: PropTypes.func,
  onRowChange: PropTypes.func,
  row: PropTypes.object,
  rowIdx: PropTypes.number,
}

export default CellEditor
