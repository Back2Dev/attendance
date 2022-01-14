import React, { useRef, useState, useMemo } from 'react'
import styled from 'styled-components'
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Button,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import PropTypes from 'prop-types'
import { useContext } from 'react'
import { CollectionContext } from '../../context'
import SimpleSchema from 'simpl-schema'

const StyledArrayField = styled(TextField)`
  display: flex;
  width: 100%;
  height: 100%;
  > div {
    flex: 1;
    font-size: 14px;
    input {
      font-size: 14px;
    }
  }
`
const StyledDialogContent = styled(DialogContent)`
  min-width: 300px;
  min-height: 100px;
`
const StyledChip = styled(Chip)`
  height: 28px;
  margin-right: 5px;
`

function ArrayField(props) {
  const { schema, updateCell } = useContext(CollectionContext)
  // console.log('Schema', schema._schema)
  // console.log('Schema', schema._schema[`${props.column.key}.$`])
  console.log('ArrayField', props)
  const { row, column, onRowChange, onClose } = props

  const [open, setOpen] = useState(true)
  const [selectedItems, setSelectedItems] = useState(row[column.key] || [])
  const [text, setText] = useState('')

  const value = row[column.key]

  const cellSchema = schema._schema?.[`${props.column.key}.$`]?.type?.definitions?.[0]
  console.log('cellSchema', cellSchema)
  // console.log('cell type', typeof cellSchema.type?.(value) === 'string')

  const options = useMemo(() => {
    if (!cellSchema.allowedValues) {
      return []
    }
    return cellSchema.allowedValues
  }, [cellSchema.allowedValues])

  const handleDelete = (item) => {
    console.log('delete', item)
    setSelectedItems(selectedItems.filter((i) => i !== item))
  }

  const handleAdd = (item) => {
    if (!item) {
      return
    }
    setSelectedItems([...selectedItems, item])
    setText('')
  }

  const handleSave = () => {
    console.log('save', selectedItems)
    const newRow = { ...row, [column.key]: selectedItems }
    console.log(newRow)
    // onRowChange(newRow)
    updateCell({
      rowId: row._id,
      column: column.key,
      value: selectedItems,
      cb: (result) => {
        if (result.status === 'success') {
          onClose()
          setOpen(false)
        }
      },
    })
  }

  const renderTextField = () => {
    const formated = value ? JSON.stringify(value) : '[]'
    // console.log('value', value, formated)
    return (
      <StyledArrayField
        defaultValue={formated}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(event) => {
          console.log(event.target.value)
          try {
            const arrayValue = JSON.parse(event.target.value)
            if (arrayValue) {
              onRowChange({ ...row, [column.key]: arrayValue })
            }
          } catch (error) {
            console.log(error)
          }
        }}
      />
    )
  }

  if (cellSchema.type instanceof SimpleSchema) {
    return renderTextField()
  }

  if (
    typeof cellSchema.type === 'function' &&
    typeof cellSchema.type?.(value) !== 'string'
  ) {
    return renderTextField()
  }

  console.log(value)
  console.log('options', options)

  const renderSelectedItems = () => {
    return selectedItems.map((item) => (
      <StyledChip key={item} label={item} onDelete={() => handleDelete(item)} />
    ))
  }

  const renderAddBtn = () => {
    if (cellSchema.allowedValues?.length) {
      return null
    }
    if (!text) {
      return null
    }
    return (
      <Button color="primary" onClick={() => handleAdd(text)}>
        Add
      </Button>
    )
  }

  const renderAutocomplete = () => {
    if (!cellSchema.allowedValues?.length) {
      return null
    }
    return (
      <Autocomplete
        options={options}
        getOptionLabel={(item) => {
          return item
        }}
        getOptionDisabled={(item) => selectedItems?.includes(item)}
        freeSolo={cellSchema.allowedValues?.length ? false : true}
        style={{}}
        renderInput={(params) => {
          console.log('input params', params)
          return <TextField {...params} size="small" fullWidth />
        }}
        onChange={(event, selected) => {
          console.log('selected', selected)
          if (selected) {
            setSelectedItems([...selectedItems, selected])
          }
        }}
        blurOnSelect={true}
      />
    )
  }

  const renderSingleTextInput = () => {
    if (cellSchema.allowedValues?.length) {
      return null
    }
    return (
      <div>
        <TextField
          size="small"
          fullWidth
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        {renderAddBtn()}
      </div>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
        onClose()
      }}
      aria-labelledby="array-editor-dialog-title"
    >
      <DialogTitle>Edit {column.name || column.key}</DialogTitle>
      <StyledDialogContent>
        <div>{renderSelectedItems()}</div>
        {renderAutocomplete()}
        {renderSingleTextInput()}
      </StyledDialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            console.log('cancel')
            onClose()
          }}
        >
          Cancel
        </Button>
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ArrayField.propTypes = {
  column: PropTypes.object,
  onClose: PropTypes.func,
  onRowChange: PropTypes.func,
  row: PropTypes.object,
  rowIdx: PropTypes.number,
}

export default ArrayField
