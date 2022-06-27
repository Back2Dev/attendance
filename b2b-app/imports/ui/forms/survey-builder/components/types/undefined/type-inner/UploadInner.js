import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
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

const filterList = ['name', 'type', 'image', 'answers', 'pid', 'optional']

const UploadInner = ({ pid, part, setPropertyByValue }) => {
  const classes = useStyles()
  const { add, remove } = usePartAnswers(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const showMobileActions = isMobile && selectedPart === pid
  const theme = useTheme()

  const getStyle = (style, snapshot, lockAxis) => {
    if (!snapshot.isDragging) return style
    return {
      ...lockAxis('y', style),
      boxShadow: theme.shadows[3],
      background: theme.palette.background.paper,
    }
  }
  const [isIdChecked, setIsIdChecked] = useState({})

  return (
    <div>
      <DndDroppable pid={pid} listAtom={partAnswers(pid)} type={pid}>
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
                        helperText={answer.optional ?? undefined}
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
      </DndDroppable>

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
