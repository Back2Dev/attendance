import React from 'react'
import { Checkbox, FormGroup, TextField, FormControlLabel } from '@material-ui/core'
import PropTypes from 'prop-types'
import { slugify } from '$sb/utils'

const UploadInner = ({ question, onQuestionChange }) => {
  const onChangeAccept = (fileType, checked) => {
    question.answers[0].accept = { ...question.answers[0]?.accept, [fileType]: checked }
    onQuestionChange({ question })
  }

  return (
    <div style={{ padding: '2rem' }}>
      <TextField
        id="MaxSize"
        label="MaxSize(MB)"
        type="number"
        variant="outlined"
        style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}
        value={Number(question.answers[0]?.maxSize) || 100}
        onChange={({ target: { value } }) =>
          // onQuestionChange({ key: 'maxSize', value, aIndex: 0 })
          {
            question.answers[0].maxSize = value
            onQuestionChange({ question })
          }
        }
      />

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={question.answers[0]?.accept?.['.pdf'] || false}
              onChange={({ target: { checked } }) => onChangeAccept('.pdf', checked)}
            />
          }
          label="PDF"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={question.answers[0]?.accept?.['image/*'] || false}
              onChange={({ target: { checked } }) => onChangeAccept('image/*', checked)}
            />
          }
          label="IMG"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={question.answers[0]?.accept?.['.txt'] || false}
              onChange={({ target: { checked } }) => onChangeAccept('.txt', checked)}
            />
          }
          label="TEXT"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={question.answers[0]?.accept?.['video/*'] || false}
              onChange={({ target: { checked } }) => onChangeAccept('video/*', checked)}
            />
          }
          label="VIDEO"
        />
      </FormGroup>

      {/* {showMobileActions && (
        <Button
          variant="outlined"
          color="default"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => add()}
        >
          New item
        </Button>
      )} */}
    </div>
  )
}

UploadInner.propTypes = {
  question: PropTypes.object.isRequired,
  onQuestionChange: PropTypes.func,
}

export { UploadInner }
