import React, { useEffect, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, Button, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CloudDownload from '@mui/icons-material/CloudDownload'
import CreateIcon from '@mui/icons-material/Create'
import CheckBox from '@mui/icons-material/CheckBox'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import { AccountContext } from '/imports/ui/contexts/account-context'
import { showWarning } from '/imports/ui/utils/toast-alerts'
import makeNewPDF from '../components/make-new-pdf'
import usePDFTemplate from '../components/use-template-pdf'
import SignatureModal from '../components/signature-modal'
import { wordSeparator } from '/imports/api/util.js'
import RejectModal from '../components/reject-modal'
import ReviewNotes from '../components/review-notes-modal'
import PDFViewer from '/imports/ui/components/pdf-viewer/pdf-viewer.js'
import html2r from '../utils/html2r'
import SignatureDialog from '../components/draw-signature-dialog.js'
import WebformContext from '../form-context'
import { textMerge } from '/imports/api/util'
import CONSTANTS from '/imports/api/constants'
import LoadingButton from '@mui/lab/LoadingButton'
import dbg from 'debug'
import { useLocation, useParams } from 'react-router'
const debug = dbg('app:forms:core:preview')

const verbiage = {
  title: 'Important information',
  heading: ' ',
  agreeTick: 'I agree',
  paragraphs: [''],
  submit: 'Sign document',
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '36px',
    marginBottom: '36px',
  },
  content: {
    '& > *': {
      margin: '5px',
    },
  },
  actions: {
    marginTop: '10px',
  },
  media: {
    height: 250,
  },
  signatureAlert: {
    '&:hover': {
      cursor: 'pointer',
    },
    marginBottom: '15px',
  },
  epilogue: {
    fontSize: theme.typography.htmlFontSize,
  },
}))

const WebformPreview = ({
  addSignature,
  complete,
  fieldTypes,
  handleDownload,
  survey,
  task,
  userSigUrl,
  template,
  reject,
  notes,
  backToWebform,
  epilogue,
  epilogueImage,
  documentList,
  submitSignature,
  uploadSignature,
  getSMSCode,
  checkSMSCode,
  invalidateSMSCodes,
  pdfmakeTemplate,
}) => {
  const { user, profile } = useContext(AccountContext)
  const { currentRole, webDoc, signatures, job, response } = useContext(WebformContext)
  const [document, setDocument] = useState(null)
  const [open, setOpen] = useState(false) // open signature modal
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState(false)
  const [signer, setSigner] = useState(null)
  const [hasSigned, setHasSigned] = useState(false)
  const [sigDialog, setSigDialog] = useState(() => true)
  const permissions = task?.permissions?.edit || []
  const [loading, setLoading] = useState(false)

  const { token } = useParams()
  const { pathname } = useLocation()
  debug('pathname', pathname)

  let viewas = localStorage.getItem('viewas')

  const classes = useStyles()
  const setReviewNoteClose = () => {
    setReviewNotes(false)
  }
  const handleReviewOpen = () => {
    setReviewOpen(true)
  }

  const handleReviewClose = () => {
    setReviewOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSignature = () => {
    if (survey?.consent?.postConsent?.roles.includes(currentRole)) {
      setOpen(true)
    } else {
      addSignature({ signer })
    }
  }

  useEffect(() => {
    if (webDoc) {
      const sign = webDoc.signatures?.find((u) => {
        if (u.userId === user._id && new RegExp(currentRole, 'g').test(u.signer_role)) {
          return u
        }
      })
      if (sign) {
        setSigner(sign)
        // updateSignatureUrl
        setHasSigned(!!(sign.date_signed && sign.signature_url))
      }
    }
  }, [webDoc])

  useEffect(() => {
    addFields()
  }, [job, survey, template])

  const handleSubmit = () => {
    if (document) {
      let theToken = ''
      // if user is not logged in and if pathname is begin with /r-:token then theToken = token
      if (!user && pathname.startsWith('/r-')) {
        theToken = token
      }

      setLoading(true)
      return complete({ document, task, viewas, token: theToken })
    } else {
      showWarning('Missing document data')
    }
  }
  let submitDisabled

  // if (Object.keys(survey.signatures).includes(task?.role)) {
  //   submitDisabled = !hasSigned
  // }

  const addFields = async () => {
    let surveyData
    if (job) {
      debug('addFields job', job)
      surveyData = job.docs.find(
        (doc) => doc.type === task.doctype && doc.taskIds?.includes(task._id)
      )?.formData

      // // TODO: We may need to remove this fallback later
      // if (!surveyData && task.doctype !== 'ekit-q10') {
      //   // fallback to old way
      //   surveyData = job.docs.find((doc) => doc.type === task.doctype)?.formData
      // }
    } else {
      if (response) surveyData = response.formData
      else throw new Meteor.Error('No job or response found')
    }
    debug('addFields', response)
    if (CONSTANTS.WEBFORM_DOCS.includes(survey.slug) || pdfmakeTemplate)
      await makeNewPDF(surveyData, survey, signatures, setDocument, pdfmakeTemplate)
    else
      await usePDFTemplate(
        surveyData,
        survey,
        fieldTypes,
        signatures,
        template,
        setDocument
      )
  }

  const pmTask = task.role === 'PM' && currentRole === 'PM'
  // const showReject = pmTask && !hasSigned
  const needsToSign = !hasSigned && signer

  const renderSubmitButton = () => {
    debug('token', token)
    let canSubmit = false
    if (permissions.includes(currentRole)) {
      canSubmit = true
    }
    if (task.assignedTo === user?._id) {
      canSubmit = true
    }
    if (!user && token) {
      canSubmit = true
    }

    if (pmTask) {
      return (
        <Button
          data-cy="submit-webform"
          id="complete-step"
          disabled={!document || submitDisabled}
          onClick={handleSubmit}
          color="cta"
          variant="contained"
          startIcon={<CheckBox />}
          className={classes.bottomButtons}
          fullWidth
        >
          Approve
        </Button>
      )
    }
    return (
      <LoadingButton
        data-cy="submit-webform"
        id="complete-step"
        disabled={!document || submitDisabled || !canSubmit || loading}
        loading={loading}
        loadingPosition="start"
        onClick={handleSubmit}
        color="primary"
        variant="contained"
        startIcon={<CheckBox />}
        className={classes.bottomButtons}
        fullWidth
      >
        Submit
      </LoadingButton>
    )
  }

  const content = () => {
    const img = epilogueImage
    return (
      <>
        <div className={classes.content}>
          {backToWebform()}
          <Button
            id="download"
            data-cy="download-preview"
            onClick={() => handleDownload(document)}
            color="primary"
            variant="contained"
            startIcon={<CloudDownload />}
          >
            Download
          </Button>
          <Typography variant="h4">{survey?.name}</Typography>
          {epilogueImage && (
            <Card className={classes.introCard}>
              <CardMedia
                className={classes.media}
                image={epilogueImage}
                title="Epilogue"
              />
            </Card>
          )}

          <div className={classes.epilogue}>
            {epilogue &&
              html2r(
                textMerge(
                  epilogue.replace(
                    '{{documentList}}',
                    documentList?.map((doc) => `<li>${doc.otherType}</li>`).join('') ||
                      'No documents are required'
                  ),
                  formData
                )
              )}
          </div>
        </div>
      </>
    )
  }

  const actions = () => {
    return (
      <div className={classes.actions}>
        {needsToSign && !userSigUrl && (
          <div>
            <Alert
              severity="info"
              data-cy="sign-alert"
              className={classes.signatureAlert}
              onClick={() => setSigDialog(true)}
            >
              Please add your signature by clicking here.
            </Alert>
            <SignatureDialog
              open={sigDialog}
              handleClose={() => setSigDialog(false)}
              submitSignature={submitSignature}
              uploadSignature={uploadSignature}
            />
          </div>
        )}
        <Grid container spacing={1}>
          <Grid item md={12}>
            {!submitDisabled && renderSubmitButton()}
          </Grid>
          <Grid item md={pmTask && needsToSign ? 4 : 12}>
            {pmTask && (
              <Button
                data-cy="preview-reject-btn"
                id="reject"
                variant="contained"
                color="secondary"
                onClick={handleReviewOpen}
                className={classes.bottomButtons}
                startIcon={<ThumbDownIcon />}
                fullWidth
              >
                Reject
              </Button>
            )}
          </Grid>
          <Grid item md={pmTask && needsToSign ? 8 : 12}>
            {needsToSign && (
              <>
                <Button
                  id="sign"
                  color="primary"
                  onClick={handleSignature}
                  variant="contained"
                  startIcon={<CreateIcon />}
                  className={classes.bottomButtons}
                  disabled={!userSigUrl}
                  fullWidth
                  data-cy="approve"
                >
                  Sign
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </div>
    )
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <PDFViewer
          document={document}
          content={content}
          title={job?.shortAddress}
          actions={actions}
          pdfSettingKey={`webform-preview-${task?._id}`}
        />
      </Grid>
      <SignatureModal
        handleClose={handleClose}
        open={open}
        addSignature={addSignature}
        signer={signer}
        verbiage={survey?.consent?.postConsent?.instructions || verbiage}
        userSigUrl={userSigUrl}
        getSMSCode={getSMSCode}
        checkSMSCode={checkSMSCode}
        invalidateSMSCodes={invalidateSMSCodes}
      />
      <RejectModal handleClose={handleReviewClose} open={reviewOpen} reject={reject} />
      <ReviewNotes handleClose={setReviewNoteClose} open={reviewNotes} notes={notes} />
    </Grid>
  )
}

WebformPreview.propTypes = {
  addSignature: PropTypes.func.isRequired,
  complete: PropTypes.func.isRequired,
  fieldTypes: PropTypes.object.isRequired,
  handleDownload: PropTypes.func.isRequired,
  survey: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
  template: PropTypes.object,
  userSigUrl: PropTypes.string.isRequired,
  reject: PropTypes.func,
  notes: PropTypes.array,
  backToWebform: PropTypes.func.isRequired,
}

export default WebformPreview
