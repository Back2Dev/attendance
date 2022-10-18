import React from 'react'
import { Checkbox, FormGroup, TextField, FormControlLabel } from '@material-ui/core'
import PropTypes from 'prop-types'

// onChange={({ target: { value } }) =>
// onAnswerChange({ aIndex, key: 'name', value })
// }

const UploadInner = ({ question, onAnswerChange }) => {
  const onChangeAccept = (fileType, checked) => {
    onAnswerChange({
      aIndex: 0,
      value: { ...question.answers[0]?.accept, [fileType]: checked },
      key: 'accept',
    })
  }

  return (
    <div>
      <TextField
        id="MaxSize"
        label="MaxSize(MB)"
        type="number"
        variant="outlined"
        style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}
        value={Number(question.answers[0]?.maxSize) || 100}
        onChange={({ target: { value } }) =>
          onAnswerChange({ key: 'maxSize', value, aIndex: 0 })
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
  onAnswerChange: PropTypes.func,
}

export { UploadInner }
