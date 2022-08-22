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
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { TextField, Grid } from '@material-ui/core'
// import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'
// import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { OptionField } from './option-field'
// import { makeStyles } from '@material-ui/core/styles'
import { FieldImage } from './image'

const useStyles = makeStyles(() => ({
  gridRoot: {
    flexGrow: 1,
    marginBottom: '0.5rem',
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

// fieldKey: 'name', 'prompt'
const QuestionField = ({
  fieldKey,
  pid,
  setPropertyByValue,
  helperText,
  part,
  ...props
}) => {
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const showMobileActions = isMobile && selectedPart === pid

  return (
    <Grid item style={{ marginLeft: '32px' }} xs={12} md={7} lg={8}>
      <Field
        onChange={({ target: { value } }) =>
          setPropertyByValue({ path: fieldKey, value, pid })
        }
        label={getLabelFromKey(fieldKey)}
        text={part[fieldKey] || ''}
        showMobileActions={showMobileActions}
        placeholder={'Type your question/paragraph'}
        helperText={helperText}
        showMore={true}
        showUploadImage={true}
        index={pid}
        onToggle={(path) =>
          setPropertyByValue({
            path,
            pid,
          })
        }
        onUploadFinish={(value) =>
          setPropertyByValue({
            path: 'image',
            value,
            pid,
          })
        }
        options={questionOptions}
        part={part}
        underline={true}
        {...props}
      />
    </Grid>
  )
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

const filterList = ['answers', 'type', 'image', 'pid', 'optional']

const Question = ({
  pid,
  onDeleteOption,
  setPropertyByValue,
  part,
  label,
  qType,
  handleChange,
  ...props
}) => {
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const showMobileActions = isMobile && selectedPart === pid
  const fieldKey = qType === 'section' ? 'name' : 'prompt'
  const isHeaderOnly = qType === 'paragraph'
  const classes = useStyles()

  return (
    <div className={classes.gridRoot}>
      <Grid container spacing={1} alignItems="flex-end">
        <QuestionField
          fieldKey={fieldKey}
          pid={pid}
          pid_index={pid}
          setPropertyByValue={setPropertyByValue}
          part={part}
          helperText={part['optional']}
          {...props}
        />
        {!isHeaderOnly && (
          <Grid style={{ marginLeft: '32px' }} item xs={12} md={4} lg={3}>
            <TextField
              fullWidth
              select
              value={qType}
              onChange={handleChange}
              label="Question Type"
              SelectProps={{
                native: true,
              }}
            >
              {options.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </TextField>
          </Grid>
        )}

        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={8}>
            <OptionField
              part={part}
              filterList={[...filterList, fieldKey, qType === 'section' && 'prompt']}
              setPropertyByValue={setPropertyByValue}
              pid_index={pid}
              showMobileActions={showMobileActions}
              pid={pid}
              path={undefined}
            />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={2}>
            {part.image && (
              <FieldImage
                src={part.image}
                onDeleteImage={() =>
                  setPropertyByValue({
                    pid,
                    path: 'image',
                  })
                }
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

Question.propTypes = {
  /** undefined instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when delete button is clicked */
  onDeleteOption: PropTypes.func,
  /** function gets called when updating atom's value based on the input path argument */
  setPropertyByValue: PropTypes.func,
  /** question type, by default is "single"*/
  qType: PropTypes.string.isRequired,
  /** initial label to show, defaults to empty string */
  label: PropTypes.string,
  /** function gets called when text changes */
  handleChange: PropTypes.func,
}

Question.defaultProps = {
  placeholder: 'Type your question',
}

export { Question }
