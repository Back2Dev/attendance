import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import Typography from '@material-ui/core/Typography'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import {
  AutoField,
  AutoForm,
  LongTextField,
  TextField,
  RadioField,
  ListField,
  NumField,
  DateField,
  ErrorField,
  ErrorsField,
  SubmitField,
} from 'uniforms-material'
import { Context, useForm, useField } from 'uniforms'
import html2r from 'html-react-parser'
import { LinearProgressWithLabel } from '/imports/ui/utils/generic'
import getSchemas from '/imports/api/surveys/survey-schema-simple'
import { numberFormatter } from '/imports/ui/utils/formatters'

const debug = require('debug')('se:webforms-progress')
debug.enabled = true

const RenderNote = (note) => {
  return (
    <span style={{ color: 'blue' }}>
      <i>{html2r(note)}</i>
    </span>
  )
}

const Specifiers = (q) => {
  return q.answers
    .filter((a) => a.specify)
    .map((a) => {
      const otherId = `${q.id}-${a.id}-specify`
      const condition = q.qtype === 'single' ? [q.id, 'equal', a.id] : [`${q.id}-${a.id}`]
      if (a.specifyType === 'long')
        return (
          <DisplayIf key={otherId} condition={(context) => evaluate(context, condition)}>
            <LongTextField
              name={otherId}
              id={otherId}
              rows="6"
              placeholder={a.placeholder}
            ></LongTextField>
          </DisplayIf>
        )
      return (
        <DisplayIf key={otherId} condition={(context) => evaluate(context, condition)}>
          <AutoField name={otherId} id={otherId} />
        </DisplayIf>
      )
    })
}

const TextQ = ({ q, a }) => {
  const id = `${q.id}-${a.id}`
  switch (a.type) {
    case 'long':
      return (
        <LongTextField
          name={id}
          id={id}
          key={id}
          rows="6"
          placeholder={a.placeholder}
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

const RenderQ = (q, ix) => {
  const prompt = q.prompt ? html2r(q.prompt.replace(/\n/g, '<br />')) : ''
  const key = `q${q.id}${ix}`
  switch (q.qtype) {
    case 'text':
      return (
        <div key={key}>
          <span>{prompt}</span>
          {q.answers.map((a, iy) => {
            const id = `${q.id}-${a.id}`
            return (
              <span key={iy}>
                {TextQ({ q, a })}
                <ErrorField name={id} id={id}>
                  {a.name || 'This'} is required
                </ErrorField>
                <NoteIf note={a.note} field={id}></NoteIf>
              </span>
            )
          })}
        </div>
      )
    case 'multi':
      return (
        <div key={key}>
          {prompt}
          {q.answers.map((a, iy) => {
            const id = `${q.id}-${a.id}`
            return (
              <div key={`a${key}${iy}`}>
                <AutoField name={id} id={id} key={id} />
                <NoteIf note={a.note} field={id}></NoteIf>
              </div>
            )
          })}
          {Specifiers(q)}
          {/* <ErrorField name={q.id} id={q.id} /> */}
        </div>
      )
    // I don't know if we'll ever need this, just 'multi' instead
    // case 'boolean':
    case 'single':
      return (
        <div key={key}>
          <RadioField name={q.id} id={q.id} />
          <ErrorField name={q.id} id={q.id} />
          {Specifiers(q)}
          {q.answers.map((a, iy) => {
            return <NoteIf key={iy} note={a.note} field={q.id} value={a.id}></NoteIf>
          })}
        </div>
      )

    // case 'date' :
    //   return (
    //     <div key={key}>
    //       {prompt}
    //       {q.answers.map((a, iy) => {
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
      return <span key={key}>{prompt}</span>

    // case 'address':
    //   return (
    //     <span key={key}>
    //       {prompt} <p>PROPERTY ADDRESS FIELD NOT SUPPORTED YET</p>
    //     </span>
    //   )

    case 'upload':
      return (
        <span key={key}>
          {prompt} <p>UPLOAD FIELD NOT SUPPORTED YET</p>
        </span>
      )

    default:
      return (
        <div key={key}>
          {prompt}
          <AutoField name={q.id} id={q.id} />
          <ErrorField name={q.id} id={q.id} />
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
    <span style={{ color: 'blue' }}>
      <i>{html2r(note)}</i>
    </span>
  ) : null
}

// condition: ['buyerType', 'equal', 'individual']  // This is an expression
// condition: ['buyerType'] // This just wants the value to be truthy
const evaluate = (context, condition) => {
  // debug('evaluate', condition, context.model)
  if (!condition) return true
  const [lhs, op, rhs] = condition
  if (['equal', 'eq'].includes(op)) return context.model[lhs] === rhs
  if (['not equal', 'ne'].includes(op)) return context.model[lhs] !== rhs
  if (['falsy'].includes(op)) return !context.model[lhs]
  if (op === 'contains') return context.model[lhs] && context.model[lhs].includes(rhs)
  // TODO: Add more things, like 'greater', 'less' etc
  if (!op || ['truthy'].includes(op)) return !!context.model[lhs]
  return false
}

const Progress = ({ steps, save, formData, epilogue, setPreview }) => {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const initialCompletion = new Set()
  const [models, setModels] = React.useState(
    steps.map((step, ix) => {
      const model = formData[step.id] ? formData[step.id] : {}
      const valCtx = step.bridge.schema.newContext()
      valCtx.validate(model)
      if (valCtx.isValid()) initialCompletion.add(ix)
      return model
    })
  )
  const [completed, setCompleted] = React.useState(initialCompletion)

  const isCompleted = (step) => completed.has(step)

  const handlePreview = () => {
    setPreview(true)
  }

  const handleNext = () => {
    save(models)
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleFinish = () => {
    save(models)
    // Not sure why we need to do this - something to do with
    // triggering a render from inside the stepper
    setTimeout(() => setActiveStep(steps.length), 0)
  }

  const goBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const nextStep = (model) => {
    console.log('Trying next', model, completed)

    const newCompleted = completed
    if (!isCompleted(activeStep)) {
      newCompleted.add(activeStep)
    }

    setCompleted(newCompleted)
    if (activeStep <= steps.length) {
      // saves the data in the webform
      save(models)
      setActiveStep(activeStep + 1)
    }
  }

  const accClick = (stepId) => (event, isExpanded) => {
    setActiveStep(isExpanded ? stepId : false)
  }

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
    if (steps[activeStep]?.schema) {
      const { schema } = steps[activeStep]
      Object.keys(schema).forEach((key) => {
        if (schema[key].uniforms?.expression) {
          // console.log({ expression: schema[key].uniforms.expression })
          // UI Appears to update properly, even though it says not to mutate the model
          model[key] = calc(schema[key].uniforms.expression, model)
          debug(`${key} = ${model[key]}`)
        }
      })
    }
    models[activeStep] = model
    setModels(models)
  }

  const progress = (100 * completed.size) / steps.length

  return (
    <div className={classes.root}>
      <LinearProgressWithLabel variant="determinate" value={progress} />
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps &&
          steps.map((step, ix) => (
            <Step
              key={step.id}
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
                      model={models[activeStep]}
                      ref={(ref) => (step.formRef = ref)}
                    >
                      <div key={`main${ix}`}>
                        {step.prompt && (
                          <div>{html2r(step.prompt.replace(/\n/g, '<br />'))}</div>
                        )}
                        {step.questions.map((q, ix) => {
                          return (
                            <DisplayIf
                              key={q.id}
                              condition={(context) => evaluate(context, q.condition)}
                            >
                              <span key={`m${q.id}`}>
                                {RenderQ(q, ix)}
                                {q.note && RenderNote(q.note)}
                              </span>
                            </DisplayIf>
                          )
                        })}
                      </div>
                      <Button
                        id="goback"
                        disabled={activeStep === 0}
                        onClick={() => {
                          setTimeout(goBack, 0)
                        }}
                        className={classes.backButton}
                        key="back2"
                        type="button"
                      >
                        Back
                      </Button>
                      &nbsp;
                      <SubmitField className="next">Next</SubmitField>
                      &nbsp; &nbsp;
                      {progress === 100 && (
                        <Button
                          type="button"
                          id="finish"
                          variant="contained"
                          color="primary"
                          onClick={handleFinish}
                          key="next"
                        >
                          {' '}
                          Finish
                        </Button>
                      )}
                    </AutoForm>
                  </CardContent>
                </Card>
              </StepContent>
            </Step>
          ))}
      </Stepper>
      {steps && (
        <div>
          {activeStep === steps.length && completed.size === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                All steps completed
              </Typography>
              <Button id="start-again" onClick={handleReset}>
                Start again
              </Button>
              <Button
                data-cy="preview-btn"
                id="preview"
                variant="contained"
                color="primary"
                className={classes.instructions}
                onClick={handlePreview}
              >
                Preview
              </Button>
              {html2r(epilogue || '')}
            </div>
          ) : (
            <div>
              {completed.size < steps.length && (
                <Typography className={classes.instructions}>
                  Please complete each step above
                </Typography>
              )}
              <div>
                {progress === 100 && (
                  <Button
                    id="finish"
                    variant="contained"
                    color="primary"
                    onClick={handleFinish}
                    key="next"
                  >
                    {' '}
                    Finish
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const WebformPage = ({ id, formData, survey, profile, listing, methods, setPreview }) => {
  const save = (models) => {
    models.forEach((model, ix) => {
      const stepid = survey.steps[ix].id
      if (!formData[stepid]) formData[stepid] = {}
      Object.keys(model).forEach((key) => (formData[stepid][key] = model[key]))
    })
    methods.update(formData)
  }
  // Build the schema
  survey && survey.steps && getSchemas(survey)
  return (
    <Container maxWidth="sm">
      <Progress
        steps={survey.steps}
        save={save}
        epilogue={survey.epilogue}
        formData={formData}
        setPreview={setPreview}
      ></Progress>
    </Container>
  )
}

export default WebformPage
