import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Grid, MenuItem } from '@material-ui/core'
import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { QuestionField, OptionField } from './typesField'
import { makeStyles } from '@material-ui/core/styles'
import { ImageWrapper } from '$sb/components/types/undefined/image'

const options = [
  { label: 'Single', value: 'single' },
  { label: 'Multiple', value: 'multiple' },
  { label: 'Upload', value: 'upload' },
  { label: 'Text', value: 'text' },
  { label: 'Section', value: 'section' },
]

const useStyles = makeStyles(() => ({
  gridRoot: {
    flexGrow: 1,
    marginBottom: '1rem',
  },
}))

const filterList = ['answers', 'type', 'image']
/** Question renders an editable label. It's a simple wrapper around InlineEdit */
const Question = ({
  pid,
  onDeleteOption,
  setPropertyByValue,
  part,
  label,
  type,
  qType,
  handleChange,
  ...props
}) => {
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const [isIdChecked, setIsIdChecked] = useState({})
  const showMobileActions = isMobile && selectedPart === pid

  const fieldKey =
    qType === 'section' ? 'name' : qType === 'paragraph' ? 'paragraph' : 'prompt'

  const isHeaderOnly = qType === 'paragraph'
  const classes = useStyles()

  return (
    <div className={classes.gridRoot}>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item xs={isHeaderOnly ? 12 : 8}>
          <QuestionField
            fieldKey={fieldKey}
            pid={pid}
            isIdChecked={isIdChecked}
            setIsIdChecked={setIsIdChecked}
            setPropertyByValue={setPropertyByValue}
            part={part}
            {...props}
          />
        </Grid>
        {!isHeaderOnly && (
          <>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                select
                value={qType}
                onChange={handleChange}
                label="Type"
              >
                {options.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </>
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
  /** initial label to show, defaults to empty string */
  label: PropTypes.string,
  /** shows this text when label is blank */
  placeholder: PropTypes.string.isRequired,
  /** function gets called when editable field loses focus */
  onLabelChange: PropTypes.func,
  /** custom styling */
  className: PropTypes.string,
}

Question.defaultProps = {
  placeholder: 'Type your question',
}

export { Question }
