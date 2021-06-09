import React, { useState, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import html2r from 'html-react-parser'
import {
  Container,
  Card,
  Grid,
  CardHeader,
  CardMedia,
  CardContent,
  Button,
  Collapse,
  makeStyles,
} from '@material-ui/core'

import CreateIcon from '@material-ui/icons/Create'
import SkipPrevious from '@material-ui/icons/SkipPrevious'
import VisibilityIcon from '@material-ui/icons/Visibility'
import WebformRun from './webform-run'
import WebformPreview from './webform-preview'
import '/imports/ui/styles/custom-styles.css'

const STG_PROLOGUE = 1
const STG_MIDDLE = 2
const STG_EPILOGUE = 3

const useStyles = makeStyles({
  root: {
    maxWidth: 600,
  },
  media: {
    height: 300,
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
  isSigner,
  survey,
  task,
  update,
}) => {
  const [stage, setStage] = useState(STG_PROLOGUE)
  const [preview, setPreview] = useState(false)
  const [template, setTemplate] = useState(null)

  const classes = useStyles()

  const checkTemplate = async () => {
    const temp = await getTemplate()
    return setTemplate(temp)
  }

  useEffect(() => {
    checkTemplate()
  }, [preview])

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

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justify="space-around"
      alignItems="center"
      style={{ padding: '20px 200px' }}
    >
      <Grid item md={6}>
        <Button
          id="save-and-return"
          onClick={goBack}
          color="primary"
          variant="contained"
          startIcon={<SkipPrevious />}
        >
          &nbsp; Save and return later
        </Button>
      </Grid>
      <Grid item md={6} style={{ textAlign: 'right' }}>
        {preview && (
          <Button
            id="webform"
            onClick={() => setPreview(!preview)}
            color="primary"
            variant="contained"
            startIcon={!preview ? <VisibilityIcon /> : <CreateIcon />}
          >
            Back to webform
          </Button>
        )}
      </Grid>
      <Grid item md={10} style={{ textAlign: 'center' }}>
        {!preview ? (
          <div>
            <Collapse in={stage === STG_PROLOGUE}>
              <Card>
                <CardMedia
                  className={classes.media}
                  image="/images/questionnaire.png"
                  title="Questionnaire"
                />
                <CardHeader title={survey.name} subheader={listing.address} />
                <CardContent>
                  {html2r(survey?.prologue || '')}
                  <p>
                    <Button
                      onClick={() => setStage(STG_MIDDLE)}
                      id="start-webform"
                      variant="contained"
                      color="primary"
                    >
                      Get started
                    </Button>
                  </p>
                </CardContent>
              </Card>
            </Collapse>
            <Collapse in={stage === STG_MIDDLE}>
              <WebformRun
                survey={survey}
                listing={listing}
                formData={formData}
                methods={methods}
                setPreview={setPreview}
              ></WebformRun>
            </Collapse>
            <Collapse in={stage === STG_EPILOGUE}>
              {html2r(survey?.prologue || '')}
            </Collapse>
          </div>
        ) : (
          <WebformPreview
            getTemplate={getTemplate}
            listing={listing}
            survey={survey}
            signatures={signatures}
            isSigner={isSigner}
            addSignature={addSignature}
            handleDownload={handleDownload}
            template={template}
            complete={complete}
            currentRole={currentRole}
            fieldTypes={fieldTypes}
            task={task}
          />
        )}
      </Grid>
    </Grid>
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
}
export default memo(Webform)
