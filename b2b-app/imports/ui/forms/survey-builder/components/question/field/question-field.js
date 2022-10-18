import React, { useState } from 'react'
import { Field } from './base'
import { useRecoilState } from 'recoil'
// import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { questionOptions } from '$sb/components/question/field/options'
import { IdAtom } from '$sb/recoil/atoms'

import PropTypes from 'prop-types'
import { TextField, Grid, InputAdornment, Button, MenuItem } from '@material-ui/core'
// import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'
// import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { OptionField } from './option-field'
// import { makeStyles } from '@material-ui/core/styles'
import { FieldImage } from './image'
import SimpleSchema from 'simpl-schema'

import { OptionList } from './option-list'
import { UploadImage } from './upload'

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    '&:before': {
      'border-bottom': '1px solid white',
    },
    '&:hover:not(.Mui-disabled)::before': {
      'border-bottom': '1px solid black',
    },
  },
}))

export const getLabelFromKey = (key) => {
  switch (key) {
    case 'val':
      return 'VALUE'
    case '_id':
      return 'ID'
    case 'id':
      return 'ID'
    default:
      return key.toUpperCase()
  }
}

const options = [
  { label: 'Single', value: 'single' },
  { label: 'Multiple', value: 'multiple' },
  { label: 'Upload', value: 'upload' },
  { label: 'Text', value: 'text' },
  // { label: 'Section', value: 'section' },
  { label: 'Signature', value: 'signature' },
  { label: 'Dropdown', value: 'dropdown' },
  { label: 'Geolocation', value: 'geolocation' },
  // { label: 'Lookup', value: 'lookup' },
  { label: 'Rating', value: 'rating' },
  { label: 'Grid', value: 'grid' },
  // { label: 'Calculation', value: 'calculation' },
]

const questionSchema = new SimpleSchema(
  { id: String, prompt: String, type: String },
  {
    clean: {
      trimStrings: false,
    },
  }
)

const Question = ({ onQuestionChange, question }) => {
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  // const showMobileActions = isMobile && selectedPart === pid

  const classes = useStyles()
  const cleanQuestion = questionSchema.clean(question)
  const [showField, setShowField] = useState(() =>
    Object.keys(questionOptions).reduce((acc, cur) => {
      return {
        ...acc,
        [cur]: false,
      }
    }, {})
  )

  const onToggle = (key) => {
    setShowField({ ...showField, [key]: !showField[key] })
  }
  console.log('cleanQuestion.prompt', cleanQuestion.prompt.length)
  return (
    <Grid container spacing={3} alignItems="flex-end" className={classes.root}>
      <Grid item xs={12} md={9} lg={10}>
        <TextField
          fullWidth
          value={cleanQuestion.prompt}
          InputProps={{
            // classes: {
            //   underline: classes.root,
            // },
            endAdornment: (
              <InputAdornment classes={{ root: classes.InputAdornment }} position="end">
                <OptionList
                  options={questionOptions}
                  onToggle={onToggle}
                  showField={showField}
                />
                {/* <UploadImage {...props} /> */}
                {/* {specify} */}
                {/* {createActions(...actions)} */}
              </InputAdornment>
            ),
          }}
          onChange={({ target: { value } }) => onQuestionChange({ key: 'prompt', value })}
          label="Question"
          placeholder="Question"
        />
      </Grid>

      <Grid item xs={12} md={3} lg={2}>
        <TextField
          fullWidth
          select
          value={cleanQuestion.type}
          onChange={({ target: { value } }) => onQuestionChange({ key: 'type', value })}
          label="Question Type"
          placeholder="Question Type"
        >
          {options.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid container spacing={1} alignItems="flex-start">
        {Object.entries(showField)
          .filter(([_, show]) => show)
          .map(([key]) => {
            return (
              <TextField
                key={key}
                fullWidth
                value={question[key] || ''}
                onChange={({ target: { value } }) => onQuestionChange({ key, value })}
                label={questionOptions[key]}
                // placeholder="Question"
              />
            )
          })}
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          {/* {part.image && (
              <FieldImage
                src={part.image}
                onDeleteImage={() =>
                  setPropertyByValue({
                    pid,
                    path: 'image',
                  })
                }
              />
            )} */}
        </Grid>
      </Grid>
    </Grid>
  )
}

Question.propTypes = {
  /** function gets called when text changes */
  onQuestionChange: PropTypes.func,
}

Question.defaultProps = {
  placeholder: 'Type your question',
}

export { Question }
