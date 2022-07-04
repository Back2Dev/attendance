import React, { Fragment } from 'react'
import { cloneDeep } from 'lodash'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import SimpleSchema from 'simpl-schema'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import Typography from '@material-ui/core/Typography'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Alert from '@material-ui/lab/Alert'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import Paper from '@material-ui/core/Paper'
import Slide from '@material-ui/core/Slide'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import DoneIcon from '@material-ui/icons/Done'
import InfoIcon from '@material-ui/icons/Info'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import {
  AutoField,
  AutoForm,
  LongTextField,
  TextField,
  RadioField,
  ListField,
  SelectField,
  NumField,
  DateField,
  ErrorField,
  ErrorsField,
  SubmitField,
  BoolField,
} from 'uniforms-material'
import { CustomAutoField } from '/imports/ui/components/forms'
import { Context, useForm, useField } from 'uniforms'
import { LinearProgressWithLabel } from '/imports/ui/utils/generic'
import getSchemas, { evaluate } from '/imports/api/surveys/survey-schema-simple'
import map2Uniforms from '/imports/api/surveys/uniforms'
import { numberFormatter } from '/imports/ui/utils/formatters'
import RejectModal from '/imports/ui/pages/webform/components/reject-modal'
import { accessByPath } from '/imports/api/util'
import html2r from '/imports/ui/utils/html2r'
import WebformContext from './context'
import { GreenButton, GreenFabButton } from '/imports/ui/utils/generic'
import Signature from '/imports/ui/components/signature'
import Geolocation from '/imports/ui/components/geolocation'
import { DropZone } from '/imports/ui/forms/survey-builder/components/types/old/upload/item'
import FormLabel from '@material-ui/core/FormLabel'

const debug = require('debug')('app:webforms-progress')

/** 
   * The config will look like this
   *      answers: {
            combine: [
              { array: 'company.directors', field: 'directors-name' },
              { array: 'individual.individuals', field: 'individuals-name' },
              { array: 'trust.trustees', field: 'trustees-name' },
            ],
          },
   */
const getAnswers = (formData, answers) => {
  if (Array.isArray(answers)) return answers
  debug({ answers, formData })
  if (typeof answers === 'object') {
    if (answers.combine) {
      const list = answers.combine
        .map((selector) => {
          const [section, field = selector.array] = selector.array.split(/[\/\.]/)
          return (
            formData[section] &&
            formData[section][field] &&
            Array.isArray(formData[section][field]) &&
            formData[section][field]
              .map((row) => {
                return row[selector.field]
              })
              .filter(Boolean)
          )
        })
        .flat()
        .filter(Boolean)
        .map((name, ix) => {
          return { id: `x${ix + 1}`, name }
        })
      debug('Computed answers', list)
      return list
    }
  }
  return []
}

const RenderNote = (note) => {
  return (
    <span style={{ color: '#4794fc' }}>
      <i>{html2r(note)}</i>
    </span>
  )
}

const Specifiers = (q) => {
  const { formData } = React.useContext(WebformContext)

  return getAnswers(formData, q.answers)
    .filter((a) => a.specify)
    .map((a) => {
      const otherId = `${q.id}-${a.id}-specify`
      const condition =
        q.type === ('single' || 'image' || 'multiple' || 'dropdown')
          ? [q.id, 'equal', a.id]
          : [`${q.id}-${a.id}`]
      if (a.specifyType === 'long')
        return (
          <DisplayIf
            key={otherId}
            condition={(context) => evaluate(formData, context.model, condition)}
          >
            <LongTextField
              name={otherId}
              id={otherId}
              minRows="2"
              placeholder={a.placeholder}
              variant="outlined"
            ></LongTextField>
          </DisplayIf>
        )
      return (
        <DisplayIf
          key={otherId}
          condition={(context) => evaluate(formData, context.model, condition)}
        >
          <AutoField name={otherId} id={otherId} />
        </DisplayIf>
      )
    })
}

const TextQ = ({ q, a }) => {
  const { formData } = React.useContext(WebformContext)

  const id = `${q.id}-${a.id}`
  switch (a.type) {
    case 'long':
      return (
        <LongTextField
          name={id}
          id={id}
          key={id}
          minRows="2"
          placeholder={a.placeholder}
          variant="outlined"
        ></LongTextField>
      )
    // TODO: Make this work
    // case 'date':
    //   return <DatePicker disabled name={id} id={id} key={id}></DatePicker>
    case 'number':
      return (
        <NumField name={id} id={id} key={id} defaultValue={a.defaultValue}></NumField>
      )
    case 'calculated':
      return <span>{a.defaultValue}</span>
    // return (
    //   <TextField
    //     disabled
    //     name={id}
    //     id={id}
    //     key={id}
    //     labelProps={{ shrink: true, disableAnimation: true }}
    //     defaultValue={a.defaultValue}
    //   ></TextField>
    // )
    default:
      return <AutoField name={id} id={id} key={id} />
  }
}

const Prompt = ({ text, tooltip, description }) => {
  let prompt = ''
  if (text) {
    const p = text.replace(/\n/g, '<br />')
    prompt = html2r(p)
  }
  const desc = description ? html2r(description.replace(/\n/g, '<br />')) : ''

  return (
    <div>
      {/* <>{prompt}</> */}
      <FormLabel component="legend">{prompt}</FormLabel>
      {desc && <p>{desc}</p>}
      {tooltip && <i>{html2r(tooltip)}</i>}
    </div>
  )
}
const RenderQ = (q, ix) => {
  const { formData } = React.useContext(WebformContext)

  const key = `q${q.id}${ix}`

  switch (q.type) {
    // case 'array':
    //   return (
    //     <div key={key}>
    //       <span>{prompt}</span>
    //       {getAnswers(formData,q.answers).map((a, iy) => {
    //         const id = `${q.id}-${a.id}`
    //         return (
    //           <span key={iy}>
    //             {TextQ({ q, a })}
    //             <ErrorField name={id} id={id}>
    //               {a.name || 'This'} is required
    //             </ErrorField>
    //             <NoteIf note={a.note} field={id}></NoteIf>
    //           </span>
    //         )
    //       })}
    //     </div>
    //   )
    case 'text':
      return (
        <div key={key} className="q-container">
          <Prompt text={q.prompt} tooltip={q.tooltip} description={q.description} />
          {q.image && <img src={q.image} width="75px" height="75px" />}
          {getAnswers(formData, q.answers).map((a, iy) => {
            const id = `${q.id}-${a.id}`
            return (
              <span key={iy}>
                {TextQ({ q, a })}
                {a.image && <img src={a.image} width="75px" height="75px" />}
                <ErrorField name={id} id={id}>
                  {a.name || 'This'} is required
                </ErrorField>
                <NoteIf note={a.note} field={id}></NoteIf>
              </span>
            )
          })}
        </div>
      )
    case 'multiple':
      return (
        <div key={key} className="q-container">
          <Prompt text={q.prompt} tooltip={q.tooltip} description={q.description} />
          {q.image && <img src={q.image} width="75px" height="75px" />}
          {getAnswers(formData, q.answers).map((a, iy) => {
            const id = `${q.id}-${a.id}`
            return (
              <div key={`a${key}${iy}`}>
                <AutoField name={id} id={id} key={id} />
                {a.image && <img src={a.image} width="75px" height="75px" />}
                <NoteIf note={a.note} field={id}></NoteIf>
              </div>
            )
          })}
          {Specifiers(q)}
          {/* <ErrorField name={q.id} id={q.id} /> */}
        </div>
      )
    case 'single':
      return (
        <div key={key} className="q-container">
          <span>
            <AutoField name={q.id} id={q.id} />
          </span>
          <ErrorField name={q.id} id={q.id} />
          {Specifiers(q)}
          {getAnswers(formData, q.answers).map((a, iy) => {
            return (
              <Fragment key={iy}>
                <NoteIf note={a.note} field={q.id} value={a.id}></NoteIf>
              </Fragment>
            )
          })}
        </div>
      )
    case 'rating':
      return (
        <div key={key} className="q-container">
          <Prompt text={q.prompt} tooltip={q.tooltip} description={q.description} />

          <AutoField name={q.id} id={q.id} />

          <ErrorField name={q.id} id={q.id} />
          {Specifiers(q)}
          {getAnswers(formData, q.answers).map((a, iy) => {
            return (
              <Fragment key={iy}>
                <NoteIf note={a.note} field={q.id} value={a.id}></NoteIf>
              </Fragment>
            )
          })}
        </div>
      )

    case 'dropdown':
      const options = getAnswers(formData, q.answers).map((a, iy) => ({
        label: a.name,
        value: a.id,
      }))
      return (
        <div key={key} className="q-container">
          <span>
            <AutoField name={q.id} id={q.id} options={options} />
          </span>
          <ErrorField name={q.id} id={q.id} />
          {Specifiers(q)}
          {getAnswers(formData, q.answers).map((a, iy) => {
            return (
              <Fragment key={iy}>
                <NoteIf note={a.note} field={q.id} value={a.id}></NoteIf>
              </Fragment>
            )
          })}
        </div>
      )

    case 'lookup':
      return (
        <span key={key} className="q-container">
          <Prompt text={q.prompt} tooltip={q.tooltip} description={q.description} />
          <span>
            <AutoField name={q.id} id={q.id} />
          </span>
          <ErrorField name={q.id} id={q.id} />
        </span>
      )

    // case 'image':
    //   return (
    //     <div key={key} className="q-container">
    //       <span>{q.prompt}</span>
    //       <div style={{ display: 'flex' }}>
    //         <AutoField name={q.id} id={q.id} />
    //       </div>
    //       <ErrorField name={q.id} id={q.id} />
    //       {Specifiers(q)}
    //       {getAnswers(formData, q.answers).map((a, iy) => {
    //         return <NoteIf key={iy} note={a.note} field={q.id} value={a.id}></NoteIf>
    //       })}
    //     </div>
    //   )
    // case 'date' :
    //   return (
    //     <div key={key}>
    //       {prompt}
    //       {getAnswers(formData,q.answers).map((a, iy) => {
    //         const id = `${q.id}-${a.id}`
    //         console.log({ id })
    //         return (
    //           <DatePicker
    //             key={`a${key}${iy}`}
    //             name={id}
    //             id={`${id}-id`}
    //             format="DD/MM/yyyy"
    //             views={['year', 'month', 'date']}
    //             labelProps={{ shrink: true, disableAnimation: true }}
    //             KeyboardButtonProps={{
    //               'aria-label': 'change  date',
    //             }}
    //           />
    //         )
    //       })}
    //     </div>
    //   )

    case 'paragraph':
      return (
        <span key={key} className="q-container">
          <Prompt text={q.prompt} tooltip={q.tooltip} description={q.description} />
          {q.image && <img src={q.image} width="75px" height="75px" />}
        </span>
      )

    case 'signature':
      return (
        <span key={key} className="q-container">
          {/* <Prompt text={q.prompt} tooltip={q.tooltip} description={q.description}  /> */}
          <Signature title={q.prompt} subheader={q.tooltip} name={q.id} id={q.id} />
          <ErrorField name={q.id} id={q.id} />
          <NoteIf note={q.note} field={q.id}></NoteIf>
        </span>
      )

    case 'geolocation':
      return (
        <span key={key} className="q-container">
          {/* <Prompt text={q.prompt} tooltip={q.tooltip} description={q.description}  /> */}
          <Geolocation title={q.prompt} subheader={q.tooltip} name={q.id} id={q.id} />
          <ErrorField name={q.id} id={q.id} />
          <NoteIf note={q.note} field={q.id}></NoteIf>
        </span>
      )

    // case 'address':
    //   return (
    //     <span key={key}>
    //       {prompt} <p>PROPERTY ADDRESS FIELD NOT SUPPORTED YET</p>
    //     </span>
    //   )

    case 'upload':
      return (
        <span key={key} className="q-container">
          <Prompt text={q.prompt} tooltip={q.tooltip} description={q.description} />
          {/* <p>UPLOAD FIELD NOT SUPPORTED - PLEASE USE DOCUMENT REQUEST MECHANISM</p> */}
          <DropZone />
        </span>
      )

    default:
      return q.type ? (
        <div key={key} className="q-container">
          <Prompt text={q.prompt} tooltip={q.tooltip} description={q.description} />
          <AutoField name={q.id} id={q.id} />
          <ErrorField name={q.id} id={q.id} />
          <NoteIf note={q.note} field={q.id}></NoteIf>
        </div>
      ) : (
        <div>
          Houston, we have a problem: {q.prompt} type={q.type}
        </div>
      )
  }
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    steplabel: {
      textAlign: 'left',
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    label: {
      color: '#666666',
      fontFamily: 'GothamRoundedMedium',
    },
    rejectButton: {
      marginTop: theme.spacing(1),
    },
    finish: {
      marginTop: theme.spacing(1),
    },
    floating: {
      position: 'fixed',
      width: '60px',
      bottom: '40%',
      right: '20px',
      textAlign: 'center',
      '& > *': {
        margin: '5px',
      },
      borderRadius: '20px',
      backgroundColor: 'white',
      [theme.breakpoints.down('sm')]: {
        right: '5px',
      },
    },
  })
)

// We have to ensure that there's only one child, because returning an array
// from a component is prohibited.
function DisplayIf({ children, condition }) {
  const uniforms = useForm()
  return condition(uniforms) ? React.Children.only(children) : null
}

function NoteIf({ note, field, value }) {
  const context = useForm()
  if (!note) return null
  let show = !field
  if (!show) {
    show = value ? context.model[field] === value : context.model[field]
  }
  return show ? (
    <span>
      <i>{html2r(note)}</i>
    </span>
  ) : null
}

const StyledRenderQ = styled.div`
  .q-container {
    margin: 15px 0px;
  }
  legend,
  .label {
    color: #666666;
    font-family: 'GothamRoundedMedium';
  }
  .MuiFormGroup-root {
    display: inline;
  }
`

const Progress = ({
  steps,
  save,
  task,
  formData,
  epilogue,
  afterDocs,
  notes,
  currentRole,
  reject,
  setDocumentList,
  documentList,
  goForwardStage,
}) => {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const initialCompletion = new Set()
  const [models, setModels] = React.useState(
    steps.reduce((acc, step, ix) => {
      try {
        const model = formData[step.id] ? formData[step.id] : {}
        // const valCtx = step.bridge.schema.newContext()
        const valCtx = new SimpleSchema(step.bridge.schema).newContext()
        valCtx.validate(model)
        if (valCtx.isValid() && Object.keys(model).length) initialCompletion.add(ix)
        acc[step.id] = model
        return acc
      } catch (e) {
        debug(`Exception ${e.message}`)
      }
    }, {})
  )
  const [completed, setCompleted] = React.useState(initialCompletion)
  const isCompleted = (step) => completed.has(step)
  const [open, setOpen] = React.useState(false)
  const [review, setReview] = React.useState(false)

  const gotoStep = (id) => {
    setActiveStep(steps.findIndex((step) => step.id === id) || 0)
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleReviewClose = () => {
    setReview(false)
  }

  const handleReviewOpen = () => {
    setReview(true)
  }

  const handleFinish = () => {
    save(models)
    if (completed.size >= numSteps() && afterDocs) {
      // At this point work out which documents we need from the data in the survey
      const docList = Object.keys(afterDocs)
        ?.map((attrib) => {
          const value = accessByPath(formData, attrib)
          if (value) {
            return {
              notes: `Created from webform ${afterDocs[attrib]}`,
              type: 'other',
              otherType: afterDocs[attrib],
              when: new Date(),
              status: 'requested',
            }
          }
        })
        .filter((x) => x)
      debug({ docList })
      setDocumentList(docList)
    }
    // Not sure why we need to do this - something to do with
    // triggering a render from inside the stepper
    setTimeout(() => setActiveStep(numSteps()), 0)
    goForwardStage()
  }

  const goBack = () => {
    // TODO: Smarter backtrack than just -1
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    window.scrollTo({
      top: 0,
      behaviour: 'smooth',
    })
    setActiveStep(0)
  }

  const scrollDown = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behaviour: 'smooth',
    })
  }

  const nextStep = (model) => {
    console.log(`${activeStep} Trying next`, model, completed)

    const newCompleted = completed
    if (!isCompleted(activeStep)) {
      newCompleted.add(activeStep)
    }

    setCompleted(newCompleted)
    if (activeStep <= numSteps()) {
      // saves the data in the webform
      debug('Saving', models)
      save(models)
      // TODO: be smarter than simply +1
      if (activeStep <= numSteps() - 1) setActiveStep(activeStep + 1)
    }
  }
  const numSteps = () => steps.filter((step) => step.visible).length

  const incrementStep = () => {}

  // TODO: If the expression is a string, parse and calculate it
  const calc = (expression, model) => {
    if (typeof expression === 'function') return expression(model)
    // Replace tokens with values from model
    const result = eval(expression)
    if (isNaN(result)) return ''
    // TODO: Format the number in Dollars and cents
    return numberFormatter(result, 0)
  }

  const changeModel = (model) => {
    // Do calculation here...
    const stepix = steps.reduce((acc, step, ix) => {
      if (!step.visible && ix <= acc) return acc + 1
      return acc
    }, activeStep)
    const step = steps[stepix]
    if (step?.schema) {
      const { schema } = step
      Object.keys(schema).forEach((key) => {
        if (schema[key].uniforms?.expression) {
          // console.log({ expression: schema[key].uniforms.expression })
          // UI Appears to update properly, even though it says not to mutate the model
          model[key] = calc(schema[key].uniforms.expression, model)
          debug(`${key} = ${model[key]}`)
        }
      })
    }
    models[step.id] = cloneDeep(model)
    setModels(models)
  }

  const progress = Math.min((100 * completed.size) / numSteps(), 100)
  debug(
    `completed.size=${completed.size}, numSteps=${numSteps()}, activeStep=${activeStep}`
  )

  return (
    <div className={classes.root}>
      <LinearProgressWithLabel variant="determinate" value={progress} />
      <Stepper activeStep={activeStep} orientation="vertical" elevation={4}>
        {steps &&
          steps
            .filter((step) => step.visible)
            .map((step, ix) => (
              <Step
                key={`${step.id}${ix}`}
                id={step.id}
                completed={isCompleted(ix)}
                onClick={() => {
                  setActiveStep(ix)
                }}
              >
                <StepLabel className={classes.steplabel} data-cy={`step-${step.id}`}>
                  {step.name}
                </StepLabel>
                <StepContent>
                  <Card key={step.id} variant="outlined">
                    <CardContent>
                      <AutoForm
                        schema={step.bridge}
                        onSubmit={nextStep}
                        onChangeModel={changeModel}
                        model={models[step.id]}
                        ref={(ref) => (step.formRef = ref)}
                      >
                        <div key={`main${ix}`}>
                          {step.prompt && (
                            <div>{html2r(step.prompt.replace(/\n/g, '<br />'))}</div>
                          )}
                          {step.questions.map((q, iy) => {
                            return (
                              <StyledRenderQ key={`${iy}`}>
                                <DisplayIf
                                  key={q.id}
                                  condition={(context) =>
                                    evaluate(formData, context.model, q.condition)
                                  }
                                >
                                  <span key={`m${q.id}`}>
                                    {RenderQ(q, iy)}
                                    {q.note && RenderNote(q.note)}
                                  </span>
                                </DisplayIf>
                              </StyledRenderQ>
                            )
                          })}
                        </div>
                        <Grid container>
                          <Grid item sm={12} align="right">
                            <Button
                              id="goback"
                              disabled={activeStep === 0}
                              onClick={() => {
                                setTimeout(goBack, 0)
                              }}
                              className={classes.backButton}
                              key="back2"
                              type="button"
                              variant="outlined"
                              color="primary"
                              data-cy="back-step"
                            >
                              Back
                            </Button>
                            <SubmitField
                              className="next"
                              color="primary"
                              data-cy="next-step"
                            >
                              Next
                            </SubmitField>
                          </Grid>
                        </Grid>
                      </AutoForm>
                    </CardContent>
                  </Card>
                </StepContent>
              </Step>
            ))}
      </Stepper>
      <Slide direction="left" in={progress === 100} mountOnEnter unmountOnExit>
        <Paper className={classes.floating} elevation={4}>
          <Tooltip placement="left" title="Start again">
            <Fab onClick={handleReset} color="primary" aria-label="up" size="small">
              <KeyboardArrowUpIcon />
            </Fab>
          </Tooltip>
          <Tooltip placement="left" title="Scroll to bottom">
            <Fab onClick={scrollDown} color="primary" aria-label="down" size="small">
              <KeyboardArrowDownIcon />
            </Fab>
          </Tooltip>
          <Tooltip placement="left" title="Finish">
            <GreenFabButton
              id="finish-side"
              data-cy="finish-side"
              onClick={handleFinish}
              aria-label="finish"
              size="small"
            >
              <DoneIcon />
            </GreenFabButton>
          </Tooltip>
        </Paper>
      </Slide>
      {steps && (
        <div>
          {progress === 100 ? (
            <div>
              <Alert severity="success" className={classes.instructions}>
                All steps completed
              </Alert>
              {task.role === 'PM' && currentRole === 'PM' && (
                <Button
                  data-cy="reject-btn"
                  id="reject"
                  variant="contained"
                  color="secondary"
                  className={classes.rejectButton}
                  onClick={handleClickOpen}
                >
                  Reject
                </Button>
              )}
              &nbsp;
              <GreenButton
                id="finish"
                data-cy="finish-btn"
                variant="contained"
                onClick={handleFinish}
                className={classes.finish}
              >
                Finish
              </GreenButton>
            </div>
          ) : (
            <div>
              {completed.size < numSteps() && (
                <Typography className={classes.instructions}>
                  Please complete each step above
                </Typography>
              )}
              <div>
                {progress === 100 && notes.length >= 1 && (
                  <Button
                    id="review-notes"
                    variant="contained"
                    color="inherit"
                    style={{ marginRight: '5px' }}
                    onClick={handleReviewOpen}
                  >
                    See review notes
                  </Button>
                )}
                {progress === 100 && activeStep !== numSteps() - 1 && (
                  <GreenButton
                    id="finish"
                    data-cy="finish-btn"
                    variant="contained"
                    onClick={handleFinish}
                    className={classes.finish}
                  >
                    Finish
                  </GreenButton>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const WebformPage = ({
  formData,
  id,
  listing,
  methods,
  profile,
  survey,
  notes,
  task,
  currentRole,
  reject,
  setDocumentList,
  documentList,
  goForwardStage,
}) => {
  const save = (models) => {
    Object.keys(models).forEach((stepid, ix) => {
      const model = models[stepid]
      // })
      // models.forEach((model, ix) => {
      // const stepid = key
      if (!formData[stepid]) formData[stepid] = {}
      Object.keys(model).forEach((key) => (formData[stepid][key] = model[key]))
    })
    methods.update(formData)
  }

  // Build the schema
  const s = map2Uniforms(survey)
  debug(s)
  const steps = getSchemas(s, formData)
  return (
    <Progress
      steps={steps}
      save={save}
      notes={notes}
      epilogue={survey.epilogue}
      afterDocs={survey['after-docs']}
      formData={formData}
      task={task}
      reject={reject}
      currentRole={currentRole}
      setDocumentList={setDocumentList}
      documentList={documentList}
      goForwardStage={goForwardStage}
    />
  )
}

export default WebformPage
