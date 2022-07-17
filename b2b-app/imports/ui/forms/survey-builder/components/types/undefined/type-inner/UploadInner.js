import React from 'react'
import { Checkbox, FormGroup, TextField, FormControlLabel } from '@material-ui/core'
import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import PropTypes from 'prop-types'

// const filterList = ['name', 'type', 'image', 'answers', 'pid', 'optional']

const UploadInner = ({ pid, part, setPropertyByValue }) => {
  // const classes = useStyles()
  // const { add, remove } = usePartAnswers(pid)
  // const selectedPart = useSelectedPartValue()
  // const { isMobile } = useBuilder()
  // const showMobileActions = isMobile && selectedPart === pid
  // const theme = useTheme()
  const onChangeAccept = (fileType, checked) => {
    setPropertyByValue({
      path: 'answers[0].accept',
      value: { ...part.answers[0]?.accept, [fileType]: checked },
      pid,
    })
  }

  return (
    <div>
      {/* <TextField
            id="maxFiles"
            label="MaxFiles"
            type="number"
            variant="outlined"
            style={{ marginBottom: '0.5em', marginTop: '0.5rem' }}
            value={property[0]?.maxFiles}
            onChange={(e) => onChange({ ...property, maxFiles: e.target.value })}
          /> */}

      <TextField
        id="MaxSize"
        label="MaxSize(MB)"
        type="number"
        variant="outlined"
        style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}
        value={Number(part.answers[0]?.maxSize) / (1024 * 1024) || 100}
        onChange={({ target: { value } }) =>
          setPropertyByValue({ path: 'answers[0].maxSize', value, pid })
        }
      />

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={part.answers[0]?.accept?.['.pdf'] || false}
              onChange={({ target: { checked } }) => onChangeAccept('.pdf', checked)}
            />
          }
          label="PDF"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={part.answers[0]?.accept?.['image/*'] || false}
              onChange={({ target: { checked } }) => onChangeAccept('image/*', checked)}
            />
          }
          label="IMG"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={part.answers[0]?.accept?.['.txt'] || false}
              onChange={({ target: { checked } }) => onChangeAccept('.txt', checked)}
            />
          }
          label="TEXT"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={part.answers[0]?.accept?.['video/*'] || false}
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
  /** single instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when updating atom's value based on the input path argument */
  setPropertyByValue: PropTypes.func,
  /** Object contains question/answers, each pid correspond to a specific part  */
  part: PropTypes.object.isRequired,
}

UploadInner.defaultProps = {
  initialList: [''],
}

export { UploadInner }
