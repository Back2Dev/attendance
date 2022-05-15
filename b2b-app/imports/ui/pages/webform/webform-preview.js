import React, { useEffect, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, Box, Button, Typography, Tooltip, makeStyles } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import CloudDownload from '@material-ui/icons/CloudDownload'
import CreateIcon from '@material-ui/icons/Create'
import CheckBox from '@material-ui/icons/CheckBox'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import SaveIcon from '@material-ui/icons/Save'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import { showWarning } from '/imports/ui/utils/toast-alerts'
import generateNewPDF from './components/make-new-pdf'
import usePDFTemplate from './components/use-template-pdf'
import SignatureModal from './components/signature-modal'
import { wordSeparator } from '/imports/api/util.js'
import RejectModal from '/imports/ui/pages/webform/components/reject-modal'
import ReviewNotes from '/imports/ui/pages/webform/components/review-notes-modal'
import PDFViewer from '/imports/ui/components/pdf-viewer/pdf-viewer.js'
import { GreenButton } from '/imports/ui/utils/generic'
import htlm2r from '/imports/ui/utils/html2r'
import WebformContext from './context'
import SignatureDialog from './components/draw-signature-dialog.js'

const verbiage = {
  title: 'Important Information',
  heading:
    'Please ensure the details are complete and current to avoid any mistakes and to ensure settlement goes smoothly.  Incorrect or out of date information may delay settlement and otherwise have unintended consequences.',
  agreeTick: 'I agree',
  paragraphs: [
    'I/We:',
    '- acknowledge that in acting on my/our behalf in connection with the purchase of the property, Settle Easy will rely on the information provided in answers to this form;',
    '- declare that the information provided in answers to this form is true and correct and may be used by and relied on by the Settle Easy in completing the required forms and documents.',
  ],
  submit: 'Sign document',
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '36px',
    marginBottom: '36px',
  },
  topContainer: {
    '& > *': {
      margin: '5px',
    },
    padding: '0 15px',
    [theme.breakpoints.up('md')]: {
      height: '50%',
    },
  },
  bottomContainer: {
    height: '50%',
    display: 'flex',
    flexDirection: 'column',
    padding: '30px',
  },
  card: {
    height: '100%',
    width: '100%',
  },
  alert: {
    width: '100%',
  },
  bottom: {
    [theme.breakpoints.up('md')]: {
      marginTop: 'auto',
    },
    '& > *': {
      margin: '5px 0',
    },
  },
  signatureAlert: {
    '&:hover': {
      cursor: 'pointer',
    },
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
  goBack,
  reject,
  notes,
  backToWebform,
  epilogue,
  documentList,
  submitSignature,
  noSignature,
}) => {
  const { user } = useContext(AccountContext)
  const { currentRole, webDoc, signatures, listing } = useContext(WebformContext)
  const [document, setDocument] = useState(null)
  const [open, setOpen] = useState(false) // open signature modal
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState(false)
  const [drawSig, setDrawSig] = useState(false)
  const [signer, setSigner] = useState(null)
  const [hasSigned, setHasSigned] = useState(false)
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
      const sign = webDoc?.signatures.find((u) => {
        if (u.userId === user._id && new RegExp(currentRole, 'g').test(u.signer_role)) {
          return u
        }
      })
      if (sign) {
        setSigner(sign)
        setHasSigned(!!(sign.date_signed && sign.signature_url))
      }
    }
  }, [webDoc])

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
  let submitDisabled

  if (Object.keys(survey.signatures).includes(task.role)) {
    submitDisabled = !hasSigned
  }

  const addFields = async () => {
    let surveyData = listing.docs.find((doc) => doc.type === survey.slug).formData
    switch (survey.slug) {
      case 'bq':
      case 'botpq':
      case 'sq':
      case 'bnf':
      case 'snf':
        generateNewPDF(surveyData, survey, signatures, setDocument)
        break
      default:
        usePDFTemplate(surveyData, survey, fieldTypes, signatures, template, setDocument)
        break
    }
  }

  const renderSubmitButton = () => {
    const permToSubmit = currentRole === 'PM' ? false : task.assignedTo !== user._id

    if (task.role === 'PM' && currentRole === 'PM') {
      return (
        <GreenButton
          data-cy="submit-webform"
          id="complete-step"
          disabled={!document || submitDisabled}
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          startIcon={<CheckBox />}
          className={classes.bottomButtons}
          fullWidth
        >
          Approve
        </GreenButton>
      )
    }
    return (
      <Button
        data-cy="submit-webform"
        id="complete-step"
        disabled={!document || submitDisabled || permToSubmit}
        onClick={handleSubmit}
        color="primary"
        variant="contained"
        startIcon={<CheckBox />}
        className={classes.bottomButtons}
        fullWidth
      >
        Submit
      </Button>
    )
  }

  const content = () => {
    return (
      <>
        <Box className={classes.topContainer}>
          {backToWebform()}
          <Button
            id="download"
            onClick={() => handleDownload(document)}
            color="primary"
            variant="contained"
            startIcon={<CloudDownload />}
          >
            Download
          </Button>
          <Typography variant="h4">{survey?.name}</Typography>
          <Typography>
            {html2r(
              epilogue?.replace(
                '{{documentList}}',
                documentList?.map((doc) => `<li>${doc.otherType}</li>`).join('') ||
                  'No documents are required'
              ) || ''
            )}
          </Typography>
        </Box>
        <Box className={classes.bottomContainer}>
          <div className={classes.bottom}>
            {!hasSigned && signer && (
              <>
                {noSignature && (
                  <>
                    <Alert
                      severity="info"
                      data-cy="sign-alert"
                      className={classes.signatureAlert}
                      onClick={() => setDrawSig(true)}
                    >
                      Please add your signature by clicking here.
                    </Alert>
                    <SignatureDialog
                      open={drawSig}
                      handleClose={() => setDrawSig(false)}
                      submitSignature={submitSignature}
                    />
                  </>
                )}
                <Button
                  id="sign"
                  color="primary"
                  onClick={handleSignature}
                  variant="contained"
                  startIcon={<CreateIcon />}
                  className={classes.bottomButtons}
                  disabled={noSignature}
                  fullWidth
                >
                  Sign
                </Button>
              </>
            )}
            {task.role === 'PM' && currentRole === 'PM' && (
              <Button
                data-cy="reject-btn"
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
            {submitDisabled ? (
              <GreenButton
                data-cy="save-webform"
                id="save-and-return"
                onClick={goBack}
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
                className={classes.bottomButtons}
                fullWidth
              >
                Save
              </GreenButton>
            ) : (
              renderSubmitButton()
            )}
          </div>
        </Box>
      </>
    )
  }
  return (
    <Grid container>
      <Grid item xs={12}>
        <PDFViewer document={document} content={content} title={listing?.shortAddress} />
      </Grid>
      <SignatureModal
        handleClose={handleClose}
        open={open}
        addSignature={addSignature}
        signer={signer}
        verbiage={survey?.consent?.postConsent?.instructions || verbiage}
        userSigUrl={userSigUrl}
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
  getTemplate: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  survey: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
  template: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  userSigUrl: PropTypes.string.isRequired,
  reject: PropTypes.func,
  notes: PropTypes.array,
  backToWebform: PropTypes.func.isRequired,
}

export default WebformPreview
