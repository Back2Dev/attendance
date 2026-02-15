import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { Grid, Button, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import html2r from 'html-react-parser'
import { textMerge } from '/imports/api/util'
import CONSTANTS from '/imports/api/constants'
import dbg from 'debug'
import { CtaButton } from '/imports/ui/components/commons/buttons.js'
import WebformContext from '/imports/ui/forms/form-context'
import { saveAs } from 'file-saver'
import { meteorCall } from '/imports/ui/utils/meteor'
import { useHistory } from 'react-router-dom'
import { AccountContext } from '/imports/ui/contexts/account-context'

const debug = dbg('app:forms:core:submitted')

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

const cusReturnURL = (task, viewas) => {
  if (viewas === 'BOSS') return '/ekit/boss/forms'
  return task ? `/ekit/forms/${task.jobId}` : '/ekit/forms'
}

const Submitted = ({ survey, formData = {}, task }) => {
  const classes = useStyles()
  const { push } = useHistory()
  const img = survey.epilogueImage || survey.prologueImage || '/epilogue/default.png'
  let viewas = localStorage.getItem('viewas')
  const { job } = useContext(WebformContext)

  const handleDownload = async () => {
    try {
      const taskId = task._id
      const url = `job_documents/${job._id}/${taskId ? `${taskId}-` : ''}${
        task.doctype
      }.pdf`

      const result = await meteorCall('task.download.URL', null, { args: { url } })

      fetch(result.data)
        .then((res) => res.blob())
        .then((blob) => {
          saveAs(blob, `${CONSTANTS.DOCUMENT_TYPES[task.doctype]}.pdf`)
        })
    } catch (e) {
      console.error(e)
    }
  }

  const backToForm = () => {
    if (!Meteor.userId()) {
      // send anonymous user to thank you page
      push(`/thank-you`)
      return
    }

    if (viewas === 'ADM' || viewas === 'WSADM') {
      // send user to participant page
      push(`/participants/${task.jobId}`)
    } else {
      push(cusReturnURL(task, viewas))
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card className={classes.introCard}>
          <CardMedia className={classes.media} image={img} title={survey.name} />
          <CardHeader
            title={survey.name}
            subheaderTypographyProps={{ className: classes.bold }}
          />
          <CardContent className={classes.introCardContent}>
            <span>
              {html2r(
                textMerge(
                  survey?.epilogue ||
                    'Thanks for filling out the form. Please click the "Submit" button to complete the process.',
                  formData
                )
              )}
            </span>
            <br />
            <div
              className={classes.introCardActions}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              {task?._id && (
                <Button type="button" onClick={handleDownload} data-cy="download">
                  Download PDF
                </Button>
              )}
              &nbsp;&nbsp;
              <CtaButton type="button" onClick={backToForm} data-cy="goto-forms">
                Submit
              </CtaButton>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

Submitted.propTypes = {
  survey: PropTypes.object.isRequired,
}

export default Submitted
