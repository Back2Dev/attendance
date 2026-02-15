import React, { useState, useEffect, memo, useContext } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import html2r from '../utils/html2r'
import {
  Container,
  Card,
  Grid,
  CardHeader,
  CardMedia,
  CardContent,
  Button,
  Collapse,
  Typography,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import SkipPrevious from '@mui/icons-material/SkipPrevious'
import { textMerge } from '/imports/api/util'
import WebformRun from './form-run'
import Submitted from './submitted'
import './custom-styles.css'
import WebformContext from '../form-context'
import dbg from 'debug'

const debug = dbg('app:forms-core')

const STG_PROLOGUE = 1
const STG_MIDDLE = 2
const STG_SUBMITTED = 3

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
    backgroundSize: 'cover',
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
  introCardContent: {
    textAlign: 'left',
  },
  introCardActions: {
    textAlign: 'right',
  },
  paper: {
    padding: '30px',
  },
  text: {
    textAlign: 'left',
    display: 'inline-block',
  },
})

let history

const Webform = ({}) => {
  const {
    currentRole,
    job,
    task = { role: 'ADM', doctype: 'na' },
    survey,
    reject,
    response,
    update,
    logit,
    approveForm,
    sendNotifications,
    notes,
    goBack,
  } = React.useContext(WebformContext)
  const [stage, setStage] = useState(survey?.prologue ? STG_PROLOGUE : STG_MIDDLE)
  const classes = useStyles()
  const [documentList, setDocumentList] = useState([])

  history = useHistory()

  useEffect(() => {
    if (survey && !survey.keepTitle) document.title = survey.name
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
    approveForm,
    logit,
    sendNotifications,
  }
  // TODO: This is weak, because you might not have a history (if you followed a form link)
  const backOut = () => history.goBack()

  let formData = {}
  let formList = {}
  if (job) {
    if (job.docs) {
      let doc = job.docs.find((d) => {
        return d.type === task.doctype && d.taskIds?.includes(task._id)
      })

      // TODO: We may need to remove this fallback later
      // if (!doc && ['ekit-q10', 'ekit-q11'].includes(task.doctype)) {
      //   // fallback to old way
      //   doc = job.docs.find((d) => d.type === task.doctype)
      // }

      if (doc) {
        formData = doc.formData || {}
        formList = doc.formList || {}
      }
    }
  } else {
    if (response) {
      formData = response.formData || {}
      formList = response.formList || {}
    }
  }
  const goBackStage = () => {
    setStage(stage - 1)
  }

  const goForwardStage = () => {
    // TODO: If there is no preview, go straight to submit page
    if (survey.showPreview && stage === STG_MIDDLE) setStage(stage + 1)
    else setStage(STG_SUBMITTED)
  }

  const getStarted = () => {
    // check if externalUrl is set in task config
    if (task.config?.externalUrl) {
      // send user to the external address
      window.location.href = task.config.externalUrl
      return
    }
    setStage(STG_MIDDLE)
  }

  if (!survey) {
    return <div>Loading survey</div>
  }
  const img = survey.prologueImage || '/prologue/default.png'
  return (
    <Grid
      container
      direction="row"
      justify="space-around"
      alignItems="center"
      className={classes.root}
    >
      <Container maxWidth="md">
        {stage === STG_MIDDLE && survey.canReturn && (
          <Grid item md={6} align="left">
            <Button
              id="save-and-return"
              onClick={backOut}
              color="primary"
              variant="contained"
              startIcon={<SkipPrevious />}
              data-cy="save-and-return"
            >
              Save and return later
            </Button>
          </Grid>
        )}
        <Grid item md={12} className={classes.content}>
          <Collapse in={stage === STG_PROLOGUE}>
            <Card className={classes.introCard}>
              <CardMedia className={classes.media} image={img} title={survey.name} />
              <CardHeader
                title={survey.name}
                subheader={job?.address}
                subheaderTypographyProps={{ className: classes.bold }}
              />
              <CardContent className={classes.introCardContent}>
                <span>{html2r(textMerge(survey?.prologue, formData) || '')}</span>
                <br />
                <div className={classes.introCardActions}>
                  <Button
                    onClick={getStarted}
                    id="start-webform"
                    variant="contained"
                    color="primary"
                    data-cy="start-webform"
                  >
                    Get started
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Collapse>
          <Collapse in={stage === STG_MIDDLE}>
            <Typography variant="h1">{job?.address}</Typography>
            <WebformRun
              formData={formData}
              formList={formList}
              persons={job?.persons || []}
              methods={methods}
              survey={survey}
              notes={notes}
              setDocumentList={setDocumentList}
              documentList={documentList}
              goForwardStage={goForwardStage}
            />
          </Collapse>
          <Collapse in={stage === STG_SUBMITTED}>
            <Typography variant="h1">{job?.address}</Typography>
            <Submitted survey={survey} task={task} formData={formData} />
          </Collapse>
        </Grid>
      </Container>
    </Grid>
  )
}

Webform.propTypes = {
  goBack: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  // job: PropTypes.object.isRequired,
  // task: PropTypes.object.isRequired,
  survey: PropTypes.object.isRequired,
  // signatures: PropTypes.array.isRequired,
  // reject: PropTypes.func.isRequired,
  notes: PropTypes.array.isRequired,
}
export default memo(Webform)
