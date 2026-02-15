import React, { Fragment } from 'react'
import { Meteor } from 'meteor/meteor'
import { useHistory } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
const { titleCase } = require('title-case')
import { makeStyles, createStyles } from '@mui/styles'
import { spacing } from '@mui/system'
import { styled } from '@mui/material/styles'
import SimpleSchema from 'simpl-schema'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import Typography from '@mui/material/Typography'
import StepContent from '@mui/material/StepContent'
import StepLabel from '@mui/material/StepLabel'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import Paper from '@mui/material/Paper'
import Slide from '@mui/material/Slide'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import DoneIcon from '@mui/icons-material/Done'
import InfoIcon from '@mui/icons-material/Info'
import Box from '@mui/material/Box'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  AutoField,
  AutoForm,
  LongTextField,
  TextField,
  ErrorField,
  SubmitField,
  HiddenField,
} from 'uniforms-mui'
import { getUserRoles } from '/imports/api/users/utils'
import { showSuccess } from '/imports/ui/utils/toast-alerts'
import { useForm } from 'uniforms'
import {
  LinearProgressWithLabel,
  GreenButton,
  GreenFabButton,
} from '/imports/ui/utils/generic'
import getSchemas, { evaluate } from './survey-schema-simple'
import map2Uniforms from '/imports/ui/forms/utils/map2uniforms'
import { numberFormatter } from '../utils/formatters'
import { accessByPath, getQAId } from '../utils/util'
import html2r from '../utils/html2r'
import WebformContext from '../form-context.js'
import Signature from '../fields/signature-field'
import PhoneField from '../fields/mui-phone-number'
import Geolocation from '../fields/geolocation'
import FormLabel from '@mui/material/FormLabel'
import apiSubmit from './api-submit'
import { textMerge, doPostcalc } from '/imports/api/util'
import CustomSurvey from '../custom-surveys'
import CustomForm, {
  validators as customValidators,
  bridges as customBridges,
} from '../custom-forms'
import CustomQ from '../custom-questions'
import dbg from 'debug'
import ApproveBtn from './approve-btn'
import makeNewPDF from '/imports/ui/forms/components/make-new-pdf'
import usePDFTemplate from '/imports/ui/forms/components/use-template-pdf'
import CONSTANTS from '/imports/api/constants'
import { meteorCall } from '/imports/ui/utils/meteor'

const debug = dbg('app:webforms-progress')

/** 
   * The config will look like this
   *      answers: {
            combine: [
              { array: 'company.directors', field: 'directors.name' },
              { array: 'individual.individuals', field: 'individuals.name' },
              { array: 'trust.trustees', field: 'trustees.name' },
            ],
          },
   */
const getAnswers = (formData, answers) => {
  if (Array.isArray(answers)) return answers
  // debug({ answers, formData })
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
              .filter(Boolean)
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
      // debug('Computed answers', list)
      return list
    }
  }
  return []
}

const RenderNote = (note, data) => {
  return (
    <span style={{ color: '#4794fc' }}>
      <i>{html2r(textMerge(note, data))}</i>
    </span>
  )
}

const Specifiers = (q) => {
  const { formData } = React.useContext(WebformContext)

  return getAnswers(formData, q.answers)
    .filter((a) => a.specify)
    .map((a, ix) => {
      const qaId = getQAId(q.id, q.answers, ix)
      const otherId = `${qaId}__specify`
      const condition =
        q.type === ('single' || 'image' || 'multiple' || 'dropdown')
          ? [q.id, 'equal', a.id]
          : [qaId]
      return (
        <DisplayIf
          key={otherId}
          condition={(context) => evaluate(formData, context.model, condition)}
        >
          {a.specifyType === 'long' ? (
            <LongTextField
              name={otherId}
              id={otherId}
              minRows="2"
              label={a.specify}
              placeholder={a.placeholder}
              variant="outlined"
            />
          ) : (
            <AutoField
              name={otherId}
              id={otherId}
              variant="outlined"
              margin="dense"
              label={a.specify}
              placeholder={a.placeholder}
            />
          )}
        </DisplayIf>
      )
    })
}

const TextQ = ({ q, a, iy }) => {
  const { formData } = React.useContext(WebformContext)

  const id = getQAId(q.id, q.answers, iy) // Zero is ok here
  const placeholder = a.placeholder || a.name
  const errorMessage = a.errorMessage
  //not sure why multiline with &#10; not work for placeholder

  switch (a.type) {
    // case 'long':
    //   return (
    //     <LongTextField
    //       name={id}
    //       id={id}
    //       key={id}
    //       minRows="2"
    //       variant="outlined"
    //     ></LongTextField>
    //   )
    // TODO: Make this work
    // case 'date':
    //   return (
    //     <Fragment>
    //       <AutoField name={id} id={id} key={id}></AutoField>
    //       <ErrorField name={id} id={id}>
    //         Date is required or is invalid
    //       </ErrorField>
    //     </Fragment>
    //   )
    // case 'number':
    //   return (
    //     <NumField name={id} id={id} key={id} defaultValue={a.defaultValue} ></NumField>
    //   )
    case 'email':
      return (
        <Fragment>
          <AutoField name={id} id={id} key={id}></AutoField>
          <ErrorField name={id} id={id}>
            {errorMessage ?? null}
          </ErrorField>
        </Fragment>
      )

    case 'calculated':
      return <span>{a.defaultValue}</span>

    case 'phoneNumber':
      return (
        <Fragment>
          <PhoneField name={id} id={id} key={id}></PhoneField>
          <ErrorField name={id} id={id}>
            {errorMessage || 'Phone Number is required or is invalid'}
          </ErrorField>
        </Fragment>
      )

    case 'password':
      return (
        <Fragment>
          <AutoField placeholder={placeholder} name={id} id={id} key={id} />
          <ErrorField name={id} id={id}>
            {errorMessage || 'Password is required or is invalid'}
          </ErrorField>
          {a.confirmPassword && (
            <Fragment>
              <AutoField
                name={`${id}_2`}
                id={`${id}_2`}
                key={`${id}_2`}
                label={'Confirm Password'}
                placeholder={'Confirm Password'}
              />
              <ErrorField name={`${id}_2`} id={`${id}_2`}>
                {errorMessage || 'Confirm Password is required or is inconsistent'}
              </ErrorField>
            </Fragment>
          )}
        </Fragment>
      )

    default:
      return (
        <Fragment>
          <AutoField name={id} id={id} key={id} placeholder={placeholder} />
          <ErrorField name={id} id={id} errorMessage={errorMessage} />
        </Fragment>
      )
  }
}

const HiddenQ = ({ q, a, iy }) => {
  const { formData } = React.useContext(WebformContext)

  const id = getQAId(q.id, q.answers, iy) // Zero is ok here
  const placeholder = a.placeholder || a.name
  const errorMessage = a.errorMessage
  //not sure why multiline with &#10; not work for placeholder

  return (
    <Fragment>
      HIDDENQ
      <TextField name={id} id={id} key={id} defaultValue="12345" />
    </Fragment>
  )
  return (
    <Fragment>
      <HiddenField name={id} id={id} key={id}></HiddenField>
    </Fragment>
  )
}

const NavButtons = ({ activeStep, goBack, classes, handleSave, dirty, saving }) => {
  return (
    <Grid container>
      <Grid item sm={12}>
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
        &nbsp;
        {/* Button not needed <Button
          id="save"
          disabled={!dirty}
          onClick={handleSave}
          className={classes.backButton}
          key="save"
          type="button"
          variant="outlined"
          color="primary"
          data-cy="back-step"
        >
          Save
        </Button>
        &nbsp; */}
        <SubmitField className="next" color="primary" data-cy="next-step">
          Next
        </SubmitField>
        &nbsp;
        <span>{saving}</span>
      </Grid>
    </Grid>
  )
}
const Prompt = ({ text, tooltip, description, header, required = false }) => {
  let prompt = ''
  if (text) {
    const p = text.replace(/\n/g, '<br />')
    prompt = html2r(p)
  }
  const desc = description ? html2r(description.replace(/\n/g, '<br />')) : ''

  return (
    <div>
      <Box display="flex" alignItems="center">
        <FormLabel component="legend" required={required}>
          {prompt}
        </FormLabel>
        {tooltip && (
          <Tooltip title={tooltip}>
            <IconButton aria-label="tooltip">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {header && <h4>{header}</h4>}
      {desc && <p>{desc}</p>}
      {/* {tooltip && <i>{html2r(tooltip)}</i>} */}
    </div>
  )
}
const RenderQ = (q, ix, model, formData) => {
  // TODO: The context is empty at this point
  // - need to work out how to fix it, as passing props is sort of clumsy
  // const { formData } = React.useContext(WebformContext)
  // debug({ formData, model })
  const prompt = textMerge(q.prompt, formData) || ''
  const key = `q${q.id}${ix}`
  const getNote = (noteText, data) => {
    if (noteText) {
      return textMerge(noteText, data) || ''
    }
  }
  switch (q.type) {
    // case 'array':
    //   return (
    //     <div key={key}>
    //       <span>{prompt}</span>
    //       {getAnswers(formData,q.answers).map((a, iy) => {
    //         const id = `${q.id}__${a.id}`
    //         return (
    //           <span key={iy}>
    //             {TextQ({ q, a,iy })}
    //             <ErrorField name={id} id={id}>
    //               {a.name || 'This'} is required
    //             </ErrorField>
    //             <NoteIf note={getNote(a.note,formData)} field={id}></NoteIf>
    //           </span>
    //         )
    //       })}
    //     </div>
    //   )
    case 'text':
      return (
        <div key={key} className="q-container">
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={q.required}
          />
          {q.image && <img src={q.image} width="75px" height="75px" />}
          {getAnswers(formData, q.answers).map((a, iy) => {
            const id = getQAId(q.id, q.answers, iy)

            return (
              <span key={iy}>
                {TextQ({ q, a, iy })}
                {a.image && <img src={a.image} width="75px" height="75px" />}
                {/* <ErrorField name={id} id={id}>
                  {a.name || 'This'} is required
                </ErrorField> */}
                <NoteIf note={getNote(a.note, formData)} field={id}></NoteIf>
              </span>
            )
          })}
        </div>
      )

    case 'hidden':
      return (
        <div key={key} className="q-container">
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={q.required}
          />
          {getAnswers(formData, q.answers).map((a, iy) => {
            const id = getQAId(q.id, q.answers, iy)

            return <span key={iy}>{HiddenQ({ q, a, iy })}</span>
          })}
        </div>
      )

    case 'calculation':
      const answer = q.answers[0]?.expression
      const { target1, targetValue1, target2, targetValue2, operator } = answer
      const isPureCal = target1 === 'integer' && target2 === 'integer'
      return (
        <div className="q-container">
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={false}
          />
          <span>
            {isPureCal ? eval(`${targetValue1}${operator}${targetValue2}`) : model[q.id]}
          </span>
        </div>
      )

    case 'multiple':
      return (
        <div key={key} className="q-container">
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={!q.required}
          />
          {q.image && <img src={q.image} width="75px" height="75px" />}
          {getAnswers(formData, q.answers).map((a, iy) => {
            const id = getQAId(q.id, q.answers, iy)
            return (
              <div key={`a${key}${iy}`}>
                <AutoField name={id} id={id} key={id} />
                {a.image && <img src={a.image} width="75px" height="75px" />}
                <NoteIf note={getNote(a.note, formData)} field={id}></NoteIf>
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
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={!q.required}
          />

          <AutoField name={q.id} id={q.id} required={!q.required} />

          <ErrorField name={q.id} id={q.id} />
          {Specifiers(q)}
          {getAnswers(formData, q.answers).map((a, iy) => {
            return (
              <Fragment key={iy}>
                <NoteIf
                  note={getNote(a.note, formData)}
                  field={q.id}
                  value={a.id}
                ></NoteIf>
              </Fragment>
            )
          })}
        </div>
      )
    case 'rating':
      return (
        <div key={key} className="q-container">
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={!q.required}
          />

          <AutoField name={q.id} id={q.id} max={q.answers[0]?.max || 1} />

          <ErrorField name={q.id} id={q.id} />
          {Specifiers(q)}
          {getAnswers(formData, q.answers).map((a, iy) => {
            return (
              <Fragment key={iy}>
                <NoteIf
                  note={getNote(a.note, formData)}
                  field={q.id}
                  value={a.id}
                ></NoteIf>
              </Fragment>
            )
          })}
        </div>
      )

    case 'grid':
      return (
        <div key={key} className="q-container">
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={!q.required}
          />

          <AutoField name={q.id} id={q.id} data={q.answers[0]} />

          <ErrorField name={q.id} id={q.id} />
          {Specifiers(q)}
          {getAnswers(formData, q.answers).map((a, iy) => {
            return (
              <Fragment key={iy}>
                <NoteIf
                  note={getNote(a.note, formData)}
                  field={q.id}
                  value={a.id}
                ></NoteIf>
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
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={!q.required}
          />
          <AutoField name={q.id} id={q.id} options={options} />

          <ErrorField name={q.id} id={q.id}>
            Please select!
          </ErrorField>
          {Specifiers(q)}
          {getAnswers(formData, q.answers).map((a, iy) => {
            return (
              <Fragment key={iy}>
                <NoteIf
                  note={getNote(a.note, formData)}
                  field={q.id}
                  value={a.id}
                ></NoteIf>
              </Fragment>
            )
          })}
        </div>
      )

    case 'lookup':
      return (
        <span key={key} className="q-container">
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={!q.required}
          />
          <span>
            <AutoField name={q.id} id={q.id} />
          </span>
          <ErrorField name={q.id} id={q.id} />
        </span>
      )

    // case 'image':
    //   return (
    //     <div key={key} className="q-container">
    //       <span>{prompt}</span>
    //       <div style={{ display: 'flex' }}>
    //         <AutoField name={q.id} id={q.id} />
    //       </div>s
    //       {getAnswers(formData, q.answers).map((a, iy) => {
    //         return <NoteIf key={iy} note={getNote(a.note,formData)} field={q.id} value={a.id}></NoteIf>
    //       })}
    //     </div>
    //   )
    // case 'date' :
    //   return (
    //     <div key={key}>
    //       {prompt}
    //       {getAnswers(formData,q.answers).map((a, iy) => {
    //         const id = `${q.id}__${a.id}`
    //         return (
    //           <DatePicker
    //             key={`a${key}${iy}`}
    //             name={id}
    //             id={`${id}__id`}
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
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={!q.required}
          />
          {q.image && <img src={q.image} width="75px" height="75px" />}
        </span>
      )

    case 'signature':
      return (
        <span key={key} className="q-container">
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={!q.required}
          />
          <Signature
            // title={prompt}
            // subheader={q.tooltip}
            name={q.id}
            id={q.id}
            // header={q.header}
          />
          <ErrorField name={q.id} id={q.id}>
            Can't be empty!!
          </ErrorField>
          <NoteIf note={getNote(q.note, formData)} field={q.id}></NoteIf>
        </span>
      )

    case 'geolocation':
      return (
        <span key={key} className="q-container">
          {/* <Prompt text={prompt} tooltip={q.tooltip} description={q.description}  /> */}
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={!q.required}
          />
          <Geolocation
            // title={prompt}
            // subheader={q.tooltip}
            name={q.id}
            id={q.id}
            // header={q.header}
            required={!q.required}
          />
          <ErrorField name={q.id} id={q.id} />
          <NoteIf note={getNote(q.note, formData)} field={q.id}></NoteIf>
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
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={!q.required}
          />
          {/* <p>UPLOAD FIELD NOT SUPPORTED - PLEASE USE DOCUMENT REQUEST MECHANISM</p> */}
          <AutoField
            name={q.id}
            id={q.id}
            maxSize={q.answers[0].maxSize}
            accept={q.answers[0].accept}
          />
        </span>
      )

    default:
      return q.type ? (
        <div key={key} className="q-container">
          <Prompt
            text={prompt}
            tooltip={q.tooltip}
            description={q.description}
            header={q.header}
            required={q.required}
          />
          <AutoField name={q.id} id={q.id} />
          <ErrorField name={q.id} id={q.id} />
          <NoteIf note={getNote(q.note, formData)} field={q.id}></NoteIf>
        </div>
      ) : (
        <div>
          Houston, we have a problem: {prompt} type={q.type}
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
      marginRight: spacing(1),
    },
    instructions: {
      marginTop: spacing(1),
      marginBottom: spacing(1),
    },
    label: {
      color: '#666666',
      fontFamily: 'GothamRoundedMedium',
    },
    rejectButton: {
      marginTop: spacing(1),
    },
    finish: {
      marginTop: spacing(1),
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
      // [theme.breakpoints.down('sm')]: {
      //   right: '5px',
      // },
    },
  }),
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
    <span style={{ color: 'red' }}>
      <i>{html2r(note)}</i>
    </span>
  ) : null
}

// function GetCalculation({ id }) {
//   const context = useForm()

//   return <span>{context.model?.[id]}</span>
// }

const StyledRenderQ = styled('div')`
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
  formData,
  formList,
  survey,
  persons,
  epilogue = 'Thank you for completing our survey',
  afterDocs,
  notes,
  setDocumentList,
  goForwardStage,
  methods,
}) => {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [dirty, setDirty] = React.useState(false)
  const [saving, setSaving] = React.useState('')
  const initialCompletion = new Set()
  const [models, setModels] = React.useState(
    steps.reduce((acc, step, ix) => {
      try {
        const model = formData[step.id] ?? {}
        // const valCtx = step.bridge.schema.newContext()
        const valCtx = new SimpleSchema(step.bridge.schema).newContext()
        valCtx.validate(model)
        if (valCtx.isValid() && Object.keys(model).length) initialCompletion.add(ix)
        acc[step.id] = model
        return acc
      } catch (e) {
        debug(`Exception ${e.message}`)
      }
    }, {}),
  )

  const {
    signatures,
    job,
    response,
    pdfmakeTemplate,
    task = { role: 'ADM', doctype: 'na' },
  } = React.useContext(WebformContext)

  const [completed, setCompleted] = React.useState(initialCompletion)
  const isCompleted = (step) => completed.has(step)
  const [submitting, setSubmitting] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [review, setReview] = React.useState(false)
  const push = useHistory().push
  const [file, setFile] = React.useState(null)

  const scrollToRef = React.useRef(null)
  React.useEffect(() => {
    // If `scrollToRef` points to an element, then scroll it into view.
    if (scrollToRef?.current) {
      setTimeout(() => {
        debug('scrollIntoView ' + scrollToRef.current.id)
        scrollToRef.current.scrollIntoView({ smooth: true })
      }, 500)
    }
  }, [activeStep])

  // Timer for Auto Save
  const saveTimer = React.useRef(null)
  React.useEffect(() => {
    // if models change, then we need to save them
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      debug('autosave')
      handleSave()
    }, 7000) // 7s isn't that long

    return () => {
      clearTimeout(saveTimer.current)
    }
  }, [models])

  const jumpToStep = (ix, force) => {
    if (survey.canJumpStep || force) setActiveStep(ix || 0)
  }

  const onChangeCustom = (model) => {
    setDirty(true)
    changeModel(model)
    setSaving('.')
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    setSaving('Saving...')
    save(models)
    setDirty(false)
    setTimeout(() => setSaving(''), 2000) // Leave it showing for a couple of seconds
  }

  const handleReviewClose = () => {
    setReview(false)
  }

  const handleReviewOpen = () => {
    setReview(true)
  }

  const handleFinish = async () => {
    const formDone = survey.custom || completed.size >= numSteps()
    if (formDone) {
      if (survey.postcalc) doPostcalc(survey, models)
    }
    if (saveTimer?.current) clearTimeout(saveTimer.current)
    save(models)
    if (formDone) {
      showSuccess('Saving form, please wait...')
      setSubmitting(survey.submit?.submitting || 'Submitting')
      // This is an option for a standalone survey that submits data to an endpoint.
      if (survey.submit) {
        goForwardStage()
        await apiSubmit(survey, formData, methods.logit)
      }
      if (survey.notification) {
        //send a notification to notify user
        const plain_customer_data = Object.keys(formData)
          .map((section) => {
            return [section].concat(
              Object.keys(formData[section]).map((key) => {
                if (typeof formData[section][key] === 'string')
                  return `${key}: ${formData[section][key]}`
                if (Array.isArray(formData[section][key])) {
                  let values = formData[section][key]
                    .map((item) => {
                      if (typeof item === 'string') return item
                      if (item.url)
                        return `${Meteor.settings.public.S3_PUBLIC_URL}${item.url}`
                      if (item.name) return item.name
                    })
                    .join(',\n   ')
                  return `${key}: ${values}`
                }
              }),
            )
          })
          .flat()
          .join('\n')
        const html_customer_data = Object.keys(formData)
          .map((section) => {
            return [`<h3>${titleCase(section)}</h3>\n<blockquote>\n`]
              .concat(
                Object.keys(formData[section]).map((key) => {
                  if (typeof formData[section][key] === 'string')
                    return `<p>${key}: ${formData[section][key]}</p>`
                  if (Array.isArray(formData[section][key])) {
                    let values = formData[section][key]
                      .map((item) => {
                        if (typeof item === 'string') return item
                        if (item.url)
                          return `<a href="${Meteor.settings.public.S3_PUBLIC_URL}${item.url}">${item.name}</a>`
                        if (item.name) return item.name
                      })
                      .join('<br /> ')
                    return `<p>${key}: ${values}</p>`
                  }
                }),
              )
              .concat('<br /></blockquote>\n')
          })
          .flat()
          .join('\n')
        await methods.sendNotifications({
          slug: survey.notification.trigger,
          data: { ...models, plain_customer_data, html_customer_data },
          ...survey.notification,
        })
      }
      // TODO: Add a thanks page once submitted, with a lazy redirect to the returnUrl
      // Should this be survey.submit?.returnUrl ??? That's where the DPA setting is in the database
      if (survey.returnUrl) window.location.href = survey.returnUrl
    }
    if (formDone && afterDocs) {
      // At this point work out which (related) documents we need
      // afterDocs holds a list of data values from the data in the survey
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
      // debug({ docList })
      setDocumentList(docList)
    }
    if (task?._id) {
      // Not sure why we need to do this - something to do with
      // triggering a render from inside the stepper
      // setTimeout(() => {
      setSubmitting(survey.submit?.submitted || 'Your request has been submitted')
      jumpToStep(numSteps())
      // }, 500)
      await completeTask()
    }
    goForwardStage()
  }

  const completeTask = async () => {
    try {
      const document = await addFields()

      if (!document) {
        console.error(
          '🔧 DEBUG: No document returned from addFields - aborting task completion',
        )
        throw new Meteor.Error('No document provided to task.webform.complete')
      }

      // save document to s3
      const data = {
        type: task.doctype, // survey.slug Causes problems ? Was task.doctype
        jobId: task.jobId,
        userId: Meteor.userId(),
      }

      // TODO: Get this from the doc-types collection, but probably let the back end work it out (better)
      const approved =
        task.config?.type === 'approve' || CONSTANTS.APPROVED_DOCS.includes(task.doctype)
      let result

      if (task?._id) {
        result = await meteorCall('task.webform.complete', null, {
          id: task._id,
          data,
          document,
          approved,
        })
        if (result?.status !== 'success') return debug(`${result.message}`)
      }
      debug('completed webform')
      return result
    } catch (e) {
      console.error(e)
    }
  }

  const addFields = async () => {
    try {
      let surveyData
      if (job) {
        surveyData = job.docs.find(
          (doc) => doc.type === task.doctype && doc.taskIds?.includes(task._id),
        )?.formData
      } else {
        if (response) {
          surveyData = response.formData
        } else {
          console.error('🔧 DEBUG: No job or response found')
          throw new Meteor.Error('No job or response found')
        }
      }

      let pdf
      if (CONSTANTS.WEBFORM_DOCS.includes(survey.slug) || pdfmakeTemplate) {
        // This one is run when the form is in our list of docs, or a template is supplied
        debug('This one is run when the form is in our list of docs', pdfmakeTemplate)
        pdf = await makeNewPDF(surveyData, survey, signatures, setFile, pdfmakeTemplate)
      } else {
        // This one is run when we want to generate a generic output")
        debug('This one is run when we want to generate a generic output')
        pdf = await usePDFTemplate(surveyData, survey, {}, signatures, null, setFile)
      }

      return pdf
    } catch (e) {
      console.error('🔧 DEBUG: Error in addFields:', e)
      console.error('🔧 DEBUG: Error stack:', e.stack)
      // Return null instead of undefined so we can handle this properly
      return null
    }
  }

  const goBack = () => {
    if (activeStep > 0) {
      jumpToStep(activeStep - 1, true)
    }
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
    const newCompleted = completed
    if (!isCompleted(activeStep)) {
      newCompleted.add(activeStep)
    }

    setCompleted(newCompleted)
    if (activeStep <= numSteps()) {
      // saves the data in the webform
      // debug('Saving', models)
      save(models)
      if (activeStep <= numSteps() - 1) {
        setActiveStep(activeStep + 1)
      }
    }
  }
  const numSteps = () => steps.filter((step) => step.visible).length

  const incrementStep = () => {}

  // TODO: If the expression is a string, parse and calculate it
  const calc = (expression, model) => {
    if (Array.isArray(expression)) {
      const firstNum =
        typeof expression[0] === 'string' ? model[expression[0]] : expression[0]
      const secondNum =
        typeof expression[2] === 'string' ? model[expression[2]] : expression[2]
      const operator = expression[1]

      return eval(`${firstNum}${operator}${secondNum}`)
    }
    if (typeof expression === 'function') return expression(model)
    // Replace tokens with values from model
    const result = eval(expression)
    if (isNaN(result)) return ''
    // TODO: Format the number in Dollars and cents
    return numberFormatter(result, 0)
  }

  const onFormChange = (key, value) => {
    debug('onFormChange', { key, value })

    setDirty(true)
  }

  const changeModel = (model) => {
    // Do calculation here...
    // debugger
    debug('changeModel', model)
    const stepix = steps.reduce((acc, step, ix) => {
      if (!step.visible && ix <= acc) return acc + 1
      return acc
    }, activeStep)

    const step = steps[stepix]
    if (step?.schema) {
      const { schema } = step
      Object.keys(schema).forEach((key) => {
        if (schema[key].uniforms?.expression) {
          // UI Appears to update properly, even though it says not to mutate the model
          model[key] = calc(schema[key].uniforms.expression, model)
          // debug(`${key} = ${model[key]}`)
        }
      })
    }
    // Kwik hack to depend on step
    if (step) setModels((prev) => ({ ...prev, [step.id]: cloneDeep(model) }))
  }
  const viewas = localStorage.getItem('viewas')

  const progress = Math.min((100 * completed.size) / numSteps(), 100)
  // debug(
  //   `completed.size=${completed.size}, numSteps=${numSteps()}, activeStep=${activeStep}`
  // )
  // steps &&

  // If the whole survey is custom, just render it
  if (survey.custom) {
    // This is a hack to avoid an await
    const userRoles = [viewas] // await getUserRoles(Meteor.user())

    return (
      <CustomSurvey
        form={survey.custom}
        persons={persons}
        onSubmit={handleFinish}
        formData={formData}
        formList={formList}
        changeModel={changeModel}
        userRoles={userRoles}
      />
    )
  }
  return (
    <div className={classes.root}>
      {['WSADM', 'ADM'].includes(viewas) && false && (
        <Box
          sx={{
            position: 'sticky',
            top: 60,
            background: '#ffffff',
            padding: '0.5rem 2rem',
            zIndex: 10,
          }}
        >
          <ApproveBtn
            handleRejectClick={() => methods.approveForm('rejected')}
            handleApproveClick={() => methods.approveForm('approved')}
            status={formData.doc?.status}
          />
        </Box>
      )}
      <LinearProgressWithLabel variant="determinate" value={progress} />
      <Stepper activeStep={activeStep} orientation="vertical" elevation={4}>
        {steps &&
          steps
            .filter((step) => step.visible)
            .map((step, ix) => (
              <Step
                key={`${step.id}${ix}`}
                id={step.id}
                ref={ix === activeStep ? scrollToRef : null}
                completed={isCompleted(ix)}
                onClick={() => {
                  jumpToStep(ix)
                }}
                sx={{ scrollMargin: 66 }}
              >
                <StepLabel
                  className={classes.steplabel}
                  data-cy={`step-${step.id}`}
                  sx={{
                    '& .MuiStepLabel-label': {
                      marginBottom: 0,
                    },
                  }}
                >
                  {step.name}
                </StepLabel>
                {step.header && <h4>{step.header}</h4>}
                <StepContent>
                  <Card key={step.id} variant="outlined">
                    <CardContent>
                      {/* CAN DO A CUSTOM STEP - IE A FULLY CUSTOM STEP IN THE WIZARD */}
                      {step.custom && (
                        <div>
                          <CustomForm
                            form={step.custom}
                            schema={step.bridge}
                            onSubmit={nextStep}
                            onChangeModel={changeModel}
                            model={models ? models[step.id] : {}}
                            formData={formData}
                            onChangeCustom={onChangeCustom}
                          >
                            <br />
                            <NavButtons
                              activeStep={activeStep}
                              goBack={goBack}
                              classes={classes}
                              dirty={dirty}
                              saving={saving}
                              handleSave={handleSave}
                            />
                          </CustomForm>
                        </div>
                      )}
                      {!step.custom && (
                        <AutoForm
                          schema={step.bridge}
                          onSubmit={nextStep}
                          onChangeModel={changeModel}
                          onChange={onFormChange}
                          model={models[step.id]}
                          // ref={(ref) => (step.formRef = ref)}
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
                                      {q.custom &&
                                        CustomQ(q, iy, models[step.id], formData)}
                                      {!q.custom &&
                                        RenderQ(q, iy, models[step.id], formData)}
                                      {q.note && RenderNote(q.note, formData)}
                                    </span>
                                  </DisplayIf>
                                </StyledRenderQ>
                              )
                            })}
                          </div>
                          <NavButtons
                            activeStep={activeStep}
                            goBack={goBack}
                            classes={classes}
                            dirty={dirty}
                            saving={saving}
                            handleSave={handleSave}
                          />
                        </AutoForm>
                      )}
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
              disabled={!!submitting}
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
              <Alert
                data-cy="form-complete"
                severity="success"
                className={classes.instructions}
              >
                {submitting ||
                  survey.completeMessage || // Can remove later
                  survey.submit?.pleaseSubmit ||
                  'Form complete, please click Finish to save it.'}
              </Alert>
              {/* TODO: Revisit use of REJECT button  */}
              {false && (
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
              <Button
                data-cy="back-btn"
                id="back"
                variant="contained"
                color="secondary"
                className={classes.rejectButton}
                onClick={handleReset}
              >
                Back
              </Button>
              &nbsp;
              <GreenButton
                id="finish"
                data-cy="finish-btn"
                variant="contained"
                onClick={handleFinish}
                disabled={!!submitting}
                className={classes.finish}
              >
                Finish
              </GreenButton>
            </div>
          ) : (
            <div>
              {completed.size < numSteps() && (
                <Typography className={classes.instructions}>
                  Please fill in each step above, then you will be able to submit your
                  answers.
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
                    disabled={!!submitting}
                    className={classes.finish}
                  >
                    Finish
                  </GreenButton>
                )}
                {progress < 100 && activeStep !== numSteps() - 1 && (
                  <Alert
                    data-cy="form-complete"
                    severity="warning"
                    className={classes.instructions}
                  >
                    Form is not quite complete
                  </Alert>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const WebformRun = ({
  formData,
  formList,
  persons,
  methods,
  survey,
  notes,
  setDocumentList,
  documentList,
  goForwardStage,
}) => {
  // Build the schema
  if (!survey) debug('No survey in WebformRun (uniforms)!')
  if (!survey) return <div>Something went wrong</div>
  const s = map2Uniforms(survey)
  const steps = getSchemas(s, formData, customValidators, customBridges)

  const save = (models) => {
    Object.keys(models).forEach((stepid, ix) => {
      const model = models[stepid]
      if (!formData[stepid]) formData[stepid] = {}
      Object.keys(model).forEach((key) => (formData[stepid][key] = model[key]))
    })
    methods.update(formData, steps)
  }

  return (
    <Progress
      steps={steps}
      save={save}
      notes={notes}
      survey={survey}
      persons={persons}
      epilogue={survey.epilogue}
      afterDocs={survey['after-docs']}
      formData={formData}
      formList={formList}
      setDocumentList={setDocumentList}
      documentList={documentList}
      goForwardStage={goForwardStage}
      methods={methods}
    />
  )
}

export default WebformRun
