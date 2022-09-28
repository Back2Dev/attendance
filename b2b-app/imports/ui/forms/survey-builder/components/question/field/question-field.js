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
import { TextField, Grid, InputAdornment, Button } from '@material-ui/core'
// import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'
// import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { OptionField } from './option-field'
// import { makeStyles } from '@material-ui/core/styles'
import { FieldImage } from './image'
import SimpleSchema from 'simpl-schema'

import { OptionList } from './option-list'
import { UploadImage } from './upload'

const useStyles = makeStyles(() => ({
  hideUnderline: {
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
  { label: 'Section', value: 'section' },
  { label: 'Signature', value: 'signature' },
  { label: 'Dropdown', value: 'dropdown' },
  { label: 'Geolocation', value: 'geolocation' },
  { label: 'Lookup', value: 'lookup' },
  { label: 'Rating', value: 'rating' },
  { label: 'Grid', value: 'grid' },
  { label: 'Calculation', value: 'calculation' },
]

const questionSchema = new SimpleSchema({ id: String, prompt: String, type: String })

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
    // setShowField((prev) => {
    //   prev[key] = !prev[key]
    //   console.log(prev)
    //   return prev
    // })
    setShowField({ ...showField, [key]: !showField[key] })
  }

  return (
    <div className={classes.hideUnderline}>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item xs={12} md={8} lg={9}>
          <TextField
            fullWidth
            value={cleanQuestion.prompt}
            InputProps={{
              classes: {
                underline: classes.hideUnderline,
              },
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
            onChange={({ target: { value } }) =>
              onQuestionChange({ key: 'prompt', value })
            }
            label="Question"
            placeholder="Question"
          />
        </Grid>

        <Grid item xs={12} md={3} lg={2}>
          <TextField
            fullWidth
            select
            value={cleanQuestion.type}
            InputProps={{
              classes: {
                underline: classes.hideUnderline,
              },
            }}
            onChange={({ target: { value } }) => onQuestionChange({ key: 'type', value })}
            label="Question Type"
            placeholder="Question Type"
          >
            {options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
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
    </div>
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
