import React, { useContext, useState, useMemo } from 'react'
import styled from 'styled-components'
import { TextField } from '@material-ui/core'
import { TextEditor } from 'react-data-grid'
import Autocomplete from '@material-ui/lab/Autocomplete'
import PropTypes from 'prop-types'

import { CollectionContext } from '../../context'

const StyledTextEditorField = styled(TextField)`
  padding: 8px 0;
`

const StyledTextField = styled(TextField)`
  display: flex;
  width: 100%;
  height: 28px;
  > div {
    flex: 1;
    font-size: 14px;
    input {
      font-size: 14px;
      padding: 6px 0 0 8px !important;
    }
  }
`

function TextEditorField(props) {
  // console.log('TextEditorField', props)
  const { schema, updateCell } = useContext(CollectionContext)
  const { row, column, onRowChange, onClose } = props

  const value = row[column.key]

  const [selectedItem, setSelectedItem] = useState(value)

  const cellSchema = schema._schema?.[`${props.column.key}`]?.type?.definitions?.[0]
  console.log('cellSchema', cellSchema)

  const options = useMemo(() => {
    if (!cellSchema.allowedValues) {
      return []
    }
    return cellSchema.allowedValues
  }, [cellSchema.allowedValues])

  const renderAutocomplete = () => {
    if (!cellSchema.allowedValues?.length) {
      return null
    }
    return (
      <Autocomplete
        options={options}
        defaultValue={selectedItem}
        getOptionLabel={(item) => {
          return item
        }}
        style={{}}
        renderInput={(params) => {
          console.log('input params', params)
          return <StyledTextField {...params} size="small" fullWidth />
        }}
        onChange={(event, selected) => {
          console.log('selected', selected)
          if (selected) {
            onRowChange({ ...row, [column.key]: selected })
            setSelectedItem(selected)
          }
        }}
        blurOnSelect={true}
      />
    )
  }

  if (options.length) {
    return renderAutocomplete()
  }

  return <TextEditor {...props} />
}

TextEditorField.propTypes = {
  column: PropTypes.object,
  onRowChange: PropTypes.func,
  onClose: PropTypes.func,
  row: PropTypes.object,
  rowIdx: PropTypes.number,
}

export default TextEditorField
