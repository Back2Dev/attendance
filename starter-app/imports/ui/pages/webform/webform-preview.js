import React, { useEffect, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, Button } from '@material-ui/core'
import CloudDownload from '@material-ui/icons/CloudDownload'
import DoneAll from '@material-ui/icons/DoneAll'
import Previewer from '/imports/ui/components/pdf-previewer'
import CheckBox from '@material-ui/icons/CheckBox'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import { showWarning } from '/imports/ui/utils/toast-alerts'
import generateNewPDF from './components/make-new-pdf'
import usePDFTemplate from './components/use-template-pdf'
import FormDialog from './components/signature-modal'

const WebformPreview = ({
  addSignature,
  complete,
  fieldTypes,
  handleDownload,
  listing,
  signatures,
  survey,
  task,
  isSigner,
  template,
}) => {
  const { user } = useContext(AccountContext)

  const [document, setDocument] = useState(null)
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    addFields()
  }, [listing, survey, template])

  const handleSubmit = () => {
    if (document) {
      return complete(document)
    } else {
      showWarning('Missing document data')
    }
  }

  const addFields = async () => {
    let surveyData = listing.docs.find((doc) => doc.type === survey.slug).formData
    switch (survey.slug) {
      case 'bq':
      case 'sq':
        generateNewPDF(surveyData, survey, signatures, setDocument)
        break
      default:
        usePDFTemplate(surveyData, survey, fieldTypes, signatures, template, setDocument)
        break
    }
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Button
          id="download"
          onClick={() => handleDownload(document)}
          color="primary"
          variant="contained"
          startIcon={<CloudDownload />}
        >
          &nbsp; Download
        </Button>{' '}
        {isSigner && !signatures?.some((sig) => sig.userId === user._id) && (
          <Button
            id="sign"
            color="primary"
            onClick={handleClickOpen}
            variant="contained"
            startIcon={<DoneAll />}
          >
            Sign
          </Button>
        )}{' '}
        <Button
          data-cy="submit-webform"
          id="complete-step"
          disabled={!document}
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          startIcon={<CheckBox />}
        >
          Submit
        </Button>
      </Grid>
      <Grid item xs={12}>
        {document && <Previewer document={document} />}
      </Grid>
      <FormDialog handleClose={handleClose} open={open} addSignature={addSignature} />
    </Grid>
  )
}

WebformPreview.propTypes = {
  addSignature: PropTypes.func.isRequired,
  complete: PropTypes.func.isRequired,
  fieldTypes: PropTypes.object.isRequired,
  getTemplate: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  currentRole: PropTypes.string.isRequired,
  listing: PropTypes.object.isRequired,
  signatures: PropTypes.array.isRequired,
  survey: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
  template: PropTypes.object.isRequired,
}

export default WebformPreview
