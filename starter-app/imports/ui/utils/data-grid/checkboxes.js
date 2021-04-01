import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'

const StyledModalCheckboxes = styled.div`
  display: flex;
  height: 100%;
  .value {
    flex: 1;
  }
`
function ModalCheckboxes(props) {
  const { row, column, onRowChange, maxlen = 15, options = [] } = props
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(() => {
    const value = row[column.key]
    if (Array.isArray(value)) {
      return value
    }
    return [value]
  })
  // row[column.key]: ['value 1', 'value 2', 'value 3']
  // options: [{ text: 'some text', value: 'value 1' }]

  useEffect(() => {
    const value = row[column.key]
    if (Array.isArray(value)) {
      setData(value)
      return
    }
    setData([value])
  }, [row])

  const addToData = (value) => {
    if (!data.includes(value)) {
      const newData = [...data]
      newData.push(value)
      setData(newData)
    }
  }

  const removeFromData = (value) => {
    if (data.includes(value)) {
      const newData = []
      data.map((item) => {
        if (item !== value) {
          newData.push(item)
        }
      })
      setData(newData)
    }
  }

  const shorten = (name) => {
    if (!name) return ''
    if (name.length > maxlen) {
      return `${name.substring(0, maxlen)}...`
    }
    return name
  }

  const getDisplayText = () => {
    if (Array.isArray(data)) {
      return data.join(', ')
    }
    return `${data}`
  }

  const renderCheckboxes = () => {
    return options.map((option) => {
      return (
        <FormControlLabel
          key={option.value}
          control={
            <Checkbox
              checked={data.includes(option.value)}
              onChange={(e) => {
                if (e.target.checked) {
                  addToData(option.value)
                } else {
                  removeFromData(option.value)
                }
              }}
            />
          }
          label={option.text}
        />
      )
    })
  }

  return (
    <StyledModalCheckboxes>
      <div className="value">{shorten(getDisplayText())}</div>
      <IconButton size="small" onClick={() => setOpen(true)}>
        <EditIcon size="small" />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
          setData(row[column.key])
        }}
        fullWidth
      >
        <DialogContent>
          <FormGroup row>{renderCheckboxes()}</FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onRowChange({ ...row, [column.key]: data })
            }}
            color="primary"
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </StyledModalCheckboxes>
  )
}

export default ModalCheckboxes
