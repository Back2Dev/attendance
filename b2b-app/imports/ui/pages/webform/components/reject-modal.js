import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Button } from '@material-ui/core'
import Modal from '/imports/ui/components/commons/modal'

export default function RejectModal({ handleClose, open, reject }) {
  const valueRef = React.useRef(null)

  const handleReject = () => {
    reject(valueRef.current.value)

    handleClose()
  }

  const Content = () => {
    return (
      <>
        <TextField
          autoFocus
          id="rejection-note"
          label="Add review notes (optional)"
          rows={4}
          multiline
          inputRef={valueRef}
        />
      </>
    )
  }

  const CallToAction = () => {
    return (
      <>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          data-cy="reject-submit"
          onClick={handleReject}
          variant="contained"
          color="secondary"
        >
          Reject
        </Button>
      </>
    )
  }

  return (
    <Modal
      handleClose={handleClose}
      open={open}
      title={'Reject Document'}
      content={<Content />}
      cta={<CallToAction />}
    />
  )
}

RejectModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  reject: PropTypes.func.isRequired,
}
