import React, { useState } from 'react'
import { Grid, Checkbox, FormGroup, TextField, FormControlLabel } from '@material-ui/core'
import {
  useSelectedPartValue,
  usePartAnswers,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { useTheme } from '@material-ui/core/styles'
import { DndDraggable, DndDroppable } from '/imports/ui/forms/survey-builder/context/dnd'
import { AnswerField, OptionField } from '$sb/components/types/undefined/field/typesField'
import { partAnswers } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { uploadOptions } from '$sb/components/types/undefined/field/options'
import { makeStyles } from '@material-ui/core/styles'

import PropTypes from 'prop-types'
import { useRecoilState } from 'recoil'
import { editInspectorState } from '/imports/ui/forms/survey-builder/recoil/atoms'
import debug from 'debug'

const useStyles = makeStyles(() => ({
  uploadBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    width: '100%',
  },
}))

const filterList = ['name', 'type', 'image', 'answers']

export const UploadInner = ({ pid, part, setPropertyByValue }) => {
  const classes = useStyles()
  const { add, remove } = usePartAnswers(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const showMobileActions = isMobile && selectedPart === pid
  const theme = useTheme()
  const onChangeAccept = (fileType, checked) => {
    setPropertyByValue({
      path: 'answers[0].accept',
      value: { ...part.answers[0]?.accept, [fileType]: checked },
      pid,
    })
  }

  return (
    <div>
      <Fragment>
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
          label="MaxSize"
          type="number"
          variant="outlined"
          style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}
          value={part.answers[0]?.maxSize}
          // onChange={(e) => onChange({ ...property[0], maxSize: e.target.value })}
          onChange={({ target: { value } }) =>
            setPropertyByValue({ path: 'answers[0].maxSize', value, pid })
          }
        />

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={part.answers[0]?.accept?.['.pdf']}
                onChange={({ target: { checked } }) => onChangeAccept('.pdf', checked)}
                // onChange={(e) =>
                //   onChange({
                //     ...part.answers[0],
                //     accept: { ...part.answers[0]?.accept, '.pdf': e.target.checked },
                //   })
                // }
              />
            }
            label="PDF"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={part.answers[0]?.accept?.['image/*']}
                onChange={({ target: { checked } }) => onChangeAccept('image/*', checked)}
                // onChange={(e) =>
                //   onChange({
                //     ...part.answers[0],
                //     accept: { ...part.answers[0]?.accept, 'image/*': e.target.checked },
                //   })
                // }
              />
            }
            label="IMG"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={part.answers[0]?.accept?.['.txt']}
                onChange={({ target: { checked } }) => onChangeAccept('.txt', checked)}
                // onChange={(e) =>
                //   onChange({
                //     ...part.answers[0],
                //     accept: { ...part.answers[0]?.accept, '.txt': e.target.checked },
                //   })
                // }
              />
            }
            label="TEXT"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={part.answers[0]?.accept?.['video/*']}
                onChange={({ target: { checked } }) => onChangeAccept('video/*', checked)}
                // onChange={(e) =>
                //   onChange({
                //     ...part.answers[0],
                //     accept: { ...part.answers[0]?.accept, 'video/*': e.target.checked },
                //   })
                // }
              />
            }
            label="VIDEO"
          />
        </FormGroup>
      </Fragment>

      {/* <DndDroppable pid={pid} listAtom={partAnswers(pid)} type={pid}>
        {(provided) => (
          <ul
            style={{ paddingLeft: 0 }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {part?.answers?.map((answer, answerIndex) => {
              return (
                <DndDraggable
                  pid={pid}
                  itemId={answer.id || answer._id}
                  index={answerIndex}
                  key={answer.id || answer._id || `${pid}_${answerIndex}`}
                >
                  {(provided, snapshot, lockAxis) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getStyle(provided.draggableProps.style, snapshot, lockAxis)}
                      ref={provided.innerRef}
                    >
                      <AnswerField
                        underline={true}
                        onRemove={() => remove(answerIndex)}
                        onAdd={() => add(answerIndex)}
                        disableRemove={part.answers.length === 1}
                        setPropertyByValue={setPropertyByValue}
                        pid={pid}
                        answer={answer}
                        answerIndex={answerIndex}
                        showMobileActions={showMobileActions}
                        part={part}
                        isIdChecked={isIdChecked}
                        setIsIdChecked={setIsIdChecked}
                        options={uploadOptions}
                      />

                      <Grid container spacing={1} alignItems="flex-start">
                        <Grid item xs={6}>
                          <OptionField
                            part={part.answers[answerIndex]}
                            filterList={[...filterList]}
                            setPropertyByValue={setPropertyByValue}
                            isIdChecked={isIdChecked}
                            setIsIdChecked={setIsIdChecked}
                            showMobileActions={showMobileActions}
                            pid={pid}
                            path={`answers[${answerIndex}]`}
                          />
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={4}>
                          <div className={classes.uploadBox}>
                            <p>Drag 'n' drop some files here, or click to select files</p>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </DndDraggable>
              )
            })}
            {provided.placeholder}
          </ul>
        )}
      </DndDroppable> */}

      {showMobileActions && (
        <Button
          variant="outlined"
          color="default"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => add()}
        >
          New item
        </Button>
      )}
    </div>
  )
}
