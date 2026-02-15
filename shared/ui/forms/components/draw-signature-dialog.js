import { Meteor } from 'meteor/meteor'
import React, { useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Signature from '/imports/ui/components/signature.js'
import FilesUpload from '/imports/ui/components/commons/files-upload.js'
import TextDivider from '/imports/ui/components/text-divider.js'

const SignatureDialog = ({ open, handleClose, submitSignature, uploadSignature }) => {
  const [disabled, setDisabled] = useState(true)
  const sigRef = useRef()

  const clear = () => {
    sigRef.current && sigRef.current.clear()
    setDisabled(true)
  }

  const fileName = `${Meteor.userId()}-signature`
  const folder = 'signature'

  const metaContext = {
    fileName: fileName,
    folder: folder,
    listing: Meteor.userId(),
    fileType: 'image',
  }

  let fileExtension

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="draw-title">Draw signature</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Signature sigRef={sigRef} setDisabled={setDisabled} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={clear} fullWidth>
          Clear
        </Button>
        <Button
          disabled={disabled}
          variant="contained"
          color="primary"
          onClick={() => {
            submitSignature(sigRef)
            handleClose()
          }}
          fullWidth
        >
          Submit
        </Button>
      </DialogActions>
      <DialogContent>
        <TextDivider>Or</TextDivider>
      </DialogContent>
      <DialogTitle id="upload-title">Upload signature</DialogTitle>
      <DialogContent>
        <FilesUpload
          maxFiles={1}
          accept="image/*"
          description="Click or drag photo to this area to upload"
          metaContext={metaContext}
          addIdToName={false}
          onChange={(files) => {
            if (files[0]?.type) {
              fileExtension = files[0].type.split('/')[1]
            }
          }}
          actionAfter={() => {
            uploadSignature({
              fileName: `${metaContext.fileName}.${fileExtension}`,
              folder,
            })
          }}
          directive="publicUploads"
        />
      </DialogContent>
    </Dialog>
  )
}

SignatureDialog.propTypes = {}

export default SignatureDialog
