import { TextEditor } from 'react-data-grid'
import PropTypes from 'prop-types'

import React from 'react'
import styled from 'styled-components'

import DateTimeField from './date-time'
import ArrayField from './array'
import BooleanField from './boolean'
import TextEditorField from './text'

const StyledNoEditor = styled.div`
  padding: 0 8px;
`

function CellEditor(props) {
  const { column, onClose, onRowChange, row, rowIdx } = props
  console.log('cell editor', { column, onClose, onRowChange, row, rowIdx })

  switch (column.type) {
    case 'String':
      return <TextEditorField {...props} />
    case 'SimpleSchema.Integer':
    case 'Integer':
    case 'Number':
      return <TextEditor {...props} />
    case 'Date':
      return <DateTimeField {...props} />
    case 'Array':
      return <ArrayField {...props} />
    case 'Boolean':
      return <BooleanField {...props} />
    default:
      // return the value, not handle this
      return <StyledNoEditor>{column.formatter({ row, column })}</StyledNoEditor>
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
