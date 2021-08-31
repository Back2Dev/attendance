import React, { useState, useEffect, memo, useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import htlm2r from 'imports/ui/utils/html2r'
import {
  Container,
  Card,
  Grid,
  CardHeader,
  CardMedia,
  CardContent,
  Button,
  Collapse,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core'
import CreateIcon from '@material-ui/icons/Create'
import SkipPrevious from '@material-ui/icons/SkipPrevious'
import VisibilityIcon from '@material-ui/icons/Visibility'
import WebformRun from './webform-run'
import WebformPreview from './webform-preview'
import '/imports/ui/styles/custom-styles.css'
import WebformContext from './context'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import CONSTANTS from '/imports/api/constants'

const STG_PROLOGUE = 1
const STG_MIDDLE = 2
const STG_PREVIEW = 3

const useStyles = makeStyles({
  root: {
    marginTop: '36px',
    marginBottom: '36px',
  },
  content: {
    marginTop: '15px',
  },
  media: {
    height: 300,
  },
  fontSize: {
    fontSize: '14px',
  },
  bold: {
    fontFamily: 'GothamRoundedMedium',
  },
  introCard: {
    textAlign: 'center',
  },
  paper: {
    padding: '30px',
  },
  text: {
    textAlign: 'left',
    display: 'inline-block',
  },
})

const Webform = ({
  addSignature,
  complete,
  currentRole,
  fieldTypes,
  getTemplate,
  goBack,
  handleDownload,
  listing,
  signatures,
  survey,
  userSigUrl,
  task,
  reject,
  update,
  notes,
  submitSignature,
  webDoc,
}) => {
  const [stage, setStage] = useState(STG_PROLOGUE)
  const [template, setTemplate] = useState(null)
  const classes = useStyles()
  const [documentList, setDocumentList] = useState([])
  const { incomplete, noSignature } = useContext(AccountContext)

  const checkTemplate = async () => {
    const temp = await getTemplate()
    return setTemplate(temp)
  }

  useEffect(() => {
    if (stage === STG_PREVIEW) {
      checkTemplate()
    }
  }, [stage])

  if (task.error)
    return (
      <Container maxWidth="sm">
        <div>
          <SkipPrevious onClick={goBack} className="icons" /> Back
        </div>
        <div>Error: {task.error}</div>
      </Container>
    )

  const methods = {
    update,
  }

  const formData = listing.docs.find((doc) => doc.type === task.doctype)?.formData || {}

  const goBackStage = () => {
    setStage(stage - 1)
  }

  const goForwardStage = () => {
    setStage(stage + 1)
  }

  const directToPreview =
    signatures.filter((signature) => signature.signature_url && signature.date_signed)
      .length > 0 || task?.config?.signOnly

  const backToWebform = () => {
    // Don't show button if customer and signed already
    if (directToPreview && !CONSTANTS.NEXT_STEPS_PERMS.includes(currentRole)) {
      return
    }
    return (
      <Button
        id="webform"
        onClick={() => setStage(STG_MIDDLE)}
        color="primary"
        variant="outlined"
        startIcon={stage !== STG_PREVIEW ? <VisibilityIcon /> : <CreateIcon />}
      >
        Back to webform
      </Button>
    )
  }

  const getStarted = () => {
    if (directToPreview) {
      setStage(STG_PREVIEW)
    } else {
      setStage(STG_MIDDLE)
    }
  }
  return (
    <WebformContext.Provider
      value={{ formData, currentRole, webDoc, signatures, listing }}
    >
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        className={classes.root}
      >
        <Container maxWidth={stage === STG_PREVIEW ? 'lg' : 'md'}>
          <Grid item md={6} align="left">
            <Button
              id="save-and-return"
              onClick={goBack}
              color="primary"
              variant="contained"
              startIcon={<SkipPrevious />}
            >
              Save and return later
            </Button>
          </Grid>
          <Grid item md={12} className={classes.content}>
            <Collapse in={stage === STG_PROLOGUE}>
              <Card className={classes.introCard}>
                <CardMedia
                  className={classes.media}
                  image="/images/questionnaire.jpg"
                  title="Questionnaire"
                />
                <CardHeader
                  title={survey.name}
                  subheader={listing.address}
                  subheaderTypographyProps={{ className: classes.bold }}
                />
                <CardContent style={{ textAlign: 'left' }}>
                  <Typography>{html2r(survey?.prologue || '')}</Typography>
                  {incomplete.length > 0 && (
                    <Typography className={classes.bold}>
                      Please complete your profile{' '}
                      <Link component={RouterLink} to="/" data-cy="go-home">
                        here
                      </Link>{' '}
                      before continuing.
                    </Typography>
                  )}
                  <br />
                  <Button
                    onClick={getStarted}
                    id="start-webform"
                    variant="contained"
                    color="primary"
                    disabled={incomplete.length > 0}
                  >
                    Get started
                  </Button>
                </CardContent>
              </Card>
            </Collapse>
            <Collapse in={stage === STG_MIDDLE}>
              <Typography variant="h1">{listing.address}</Typography>
              <WebformRun
                currentRole={currentRole}
                formData={formData}
                listing={listing}
                methods={methods}
                survey={survey}
                task={task}
                reject={reject}
                notes={notes}
                setDocumentList={setDocumentList}
                documentList={documentList}
                goForwardStage={goForwardStage}
              />
            </Collapse>
            <Collapse in={stage === STG_PREVIEW}>
              {/* This conditional is to prevent the PDF from loading until needed */}
              {stage === STG_PREVIEW && (
                <WebformPreview
                  reject={reject}
                  notes={notes}
                  getTemplate={getTemplate}
                  listing={listing}
                  survey={survey}
                  signatures={signatures}
                  addSignature={addSignature}
                  handleDownload={handleDownload}
                  template={template}
                  complete={complete}
                  userSigUrl={userSigUrl}
                  fieldTypes={fieldTypes}
                  task={task}
                  goBack={goBack}
                  backToWebform={backToWebform}
                  epilogue={survey.epilogue}
                  documentList={documentList}
                  submitSignature={submitSignature}
                  noSignature={noSignature}
                />
              )}
            </Collapse>
          </Grid>
        </Container>
      </Grid>
    </WebformContext.Provider>
  )
}

Webform.propTypes = {
  goBack: PropTypes.func.isRequired,
  fieldTypes: PropTypes.object.isRequired,
  getDoc: PropTypes.func.isRequired,
  addSignature: PropTypes.func.isRequired,
  getTemplate: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  complete: PropTypes.func.isRequired,
  currentRole: PropTypes.string.isRequired,
  handleDownload: PropTypes.func.isRequired,
  listing: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
  survey: PropTypes.object.isRequired,
  practice: PropTypes.object.isRequired,
  signatures: PropTypes.array.isRequired,
  reject: PropTypes.func.isRequired,
  userSigUrl: PropTypes.string.isRequired,
  notes: PropTypes.array.isRequired,
}
export default memo(Webform)
