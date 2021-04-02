import React, { useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  TextareaAutosize,
  IconButton,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'

const StyledModalEdit = styled.div`
  display: flex;
  height: 100%;
  .value {
    flex: 1;
  }
`

function ModalEdit(props) {
  const { row, column, onRowChange, maxlen = 15 } = props
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState(row[column.key] || '')

  useEffect(() => {
    setContent(row[column.key] || '')
  }, [row])

  const shorten = (name) => {
    if (!name) return ''
    if (name.length > maxlen) {
      return `${name.substring(0, maxlen)}...`
    }
    return name
  }

  return (
    <StyledModalEdit>
      <div className="value">{shorten(row[column.key])}</div>
      <IconButton size="small" onClick={() => setOpen(true)}>
        <EditIcon size="small" />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
          setContent(row[column.key])
        }}
        fullWidth
      >
        <DialogContent>
          <FormControl fullWidth>
            <TextareaAutosize
              className="textarea"
              rowsMin={3}
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                // onRowChange({ ...row, [column.key]: e.target.value })
              }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onRowChange({ ...row, [column.key]: content })
            }}
            color="primary"
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </StyledModalEdit>
  )
}

export default ModalEdit
