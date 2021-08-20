import React from 'react'
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
import { LinearProgressWithLabel } from '/imports/ui/utils/generic'
import getSchemas, { evaluate } from '/imports/api/surveys/survey-schema-ui-schema'
import { numberFormatter } from '/imports/ui/utils/formatters'
import RejectModal from '/imports/ui/pages/webform/components/reject-modal'
import { accessByPath } from '/imports/api/util'
import html2r from '/imports/ui/utils/html2r'
import WebformContext from './context'
import { GreenButton, GreenFabButton } from '/imports/ui/utils/generic'

const debug = require('debug')('app:webforms-progress')

const Progress = ({ schema }) => {
  return (
    <div>
      <h1>ui-schema</h1>
      <pre>{JSON.stringify(schema, null, 2)}</pre>
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
  const schema = getSchemas(survey, formData)
  return <Progress schema={schema} save={save} />
}

export default WebformPage
