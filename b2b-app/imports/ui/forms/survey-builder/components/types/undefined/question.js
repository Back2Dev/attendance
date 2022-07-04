import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { TextField, Grid, MenuItem } from '@material-ui/core'
import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { QuestionField, OptionField } from './field/typesField'
import { makeStyles } from '@material-ui/core/styles'
import { ImageWrapper } from '$sb/components/types/undefined/field/image'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'

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
]

const useStyles = makeStyles(() => ({
  gridRoot: {
    flexGrow: 1,
    marginBottom: '1rem',
  },
}))

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
  const [isIdChecked, setIsIdChecked] = useState({})
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
          isIdChecked={isIdChecked}
          setIsIdChecked={setIsIdChecked}
          setPropertyByValue={setPropertyByValue}
          part={part}
          helperText={part['optional']}
          {...props}
        />
        {!isHeaderOnly && (
          <Fragment>
            <Grid item style={{ visibility: 'hidden' }}>
              <RadioButtonUncheckedIcon />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                select
                value={qType}
                onChange={handleChange}
                label="Question Type"
                SelectProps={{
                  native: true,
                }}
                // variant="outlined"
              >
                {options.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Fragment>
        )}

        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={8}>
            <OptionField
              part={part}
              filterList={[...filterList, fieldKey, qType === 'section' && 'prompt']}
              setPropertyByValue={setPropertyByValue}
              isIdChecked={isIdChecked}
              setIsIdChecked={setIsIdChecked}
              showMobileActions={showMobileActions}
              pid={pid}
              path={undefined}
            />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={2}>
            {part.image && (
              <ImageWrapper
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
