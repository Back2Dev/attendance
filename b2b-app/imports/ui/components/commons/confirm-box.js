import React, { useState, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core'

const StyledConfirmBox = styled.div`
  min-width: 300px;
  padding-bottom: 10px;
  .MuiDialogTitle-root {
    padding: 5px 20px;
  }
`

function ConfirmBox({
  open,
  title,
  message,
  yes,
  no,
  confirmCallback,
  closedCallback,
  rejectCallback,
  autoCloseOnConfirm,
}) {
  const handleClose = () => {
    // setSelfOpened(false);
    closedCallback()
  }

  const onConfirm = (e) => {
    if (typeof e.preventDefault === 'function') e.preventDefault()
    if (confirmCallback) {
      setTimeout(() => {
        confirmCallback()
      }, 200)
    }
    if (autoCloseOnConfirm) {
      handleClose()
    }
  }

  const onReject = (e) => {
    if (typeof e.preventDefault === 'function') e.preventDefault()
    if (rejectCallback) {
      setTimeout(() => {
        rejectCallback()
      }, 200)
    }
    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <StyledConfirmBox>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid container>
            <Grid item xs={6} align="center">
              <Button variant="contained" onClick={onReject} color="secondary">
                {no}
              </Button>
            </Grid>
            <Grid item xs={6} align="center">
              <Button variant="contained" onClick={onConfirm} color="primary" autoFocus>
                {yes}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </StyledConfirmBox>
    </Dialog>
  )
}

ConfirmBox.defaultProps = {
  autoCloseOnConfirm: true,
  rejectCallback: () => {},
  title: 'Are you sure?',
  message: '',
  yes: 'Yes',
  no: 'No',
}

ConfirmBox.propTypes = {
  open: PropTypes.bool.isRequired,
  confirmCallback: PropTypes.func.isRequired,
  rejectCallback: PropTypes.func,
  closedCallback: PropTypes.func.isRequired,
  autoCloseOnConfirm: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  yes: PropTypes.string,
  no: PropTypes.string,
}

export default ConfirmBox

export const ConfirmContext = React.createContext('confirmBox')

function confirmReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'config': {
      return {
        ...state,
        ...payload,
      }
    }
    case 'setOpen':
      return {
        ...state,
        open: payload,
      }
    default:
      return state
  }
}
export const ConfirmProvider = ({ children }) => {
  const [state, dispatch] = useReducer(confirmReducer, {
    open: false,
    confirmCallback: () => {},
    closedCallback: () => {},
    rejectCallback: () => {},
  })
  const config = (data) => {
    // console.log('config', data)
    dispatch({ type: 'config', payload: data })
  }
  const setOpen = (data) => {
    dispatch({ type: 'setOpen', payload: data })
  }
  return (
    <ConfirmContext.Provider value={{ config, setOpen }}>
      {children}
      <ConfirmBox
        open={state.open}
        confirmCallback={state.confirmCallback}
        closedCallback={state.closedCallback}
        rejectCallback={state.rejectCallback}
        title={state.title}
        message={state.message}
        yes={state.yes}
        no={state.no}
      />
    </ConfirmContext.Provider>
  )
}

ConfirmProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const ConfirmConsumer = ConfirmContext.Consumer

export const useConfirm = () => {
  const { setOpen, config } = useContext(ConfirmContext)

  const showConfirm = ({ onConfirm, onReject, onClose, title, message, yes, no }) => {
    config({
      confirmCallback: () => {
        setOpen(false)
        if (typeof onConfirm === 'function') {
          onConfirm()
        }
      },
      rejectCallback: () => {
        setOpen(false)
        if (typeof onReject === 'function') {
          onReject()
        }
      },
      closedCallback: () => {
        setOpen(false)
        if (typeof onClose === 'function') {
          onClose()
        }
      },
      title,
      message,
      yes,
      no,
      open: true,
    })
  }

  return {
    showConfirm,
  }
}
