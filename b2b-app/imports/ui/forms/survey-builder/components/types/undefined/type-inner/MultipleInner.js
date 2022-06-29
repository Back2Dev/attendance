import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ImageWrapper } from '$sb/components/types/undefined/field/image'
import AddIcon from '@material-ui/icons/Add'
import { useTheme } from '@material-ui/core/styles'
import { usePartAnswers, useSelectedPartValue } from '$sb/recoil/hooks'
import { partAnswers } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { DndDraggable, DndDroppable } from '$sb/context/dnd'
import { useBuilder } from '$sb/context'
import { Button, Grid } from '@material-ui/core'
import { multipleOptions } from '$sb/components/types/undefined/field/options'
import { AnswerField, OptionField } from '$sb/components/types/undefined/field/typesField'

const filterList = ['name', 'type', 'image', 'answers', 'pid', 'optional']

const MultipleInner = ({ pid, part, setPropertyByValue }) => {
  const { add, remove } = usePartAnswers(pid)
  const theme = useTheme()
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const [isIdChecked, setIsIdChecked] = useState({})

  const getStyle = (style, snapshot, lockAxis) => {
    if (!snapshot.isDragging) return style
    return {
      ...lockAxis('y', style),
      boxShadow: theme.shadows[3],
      background: theme.palette.background.paper,
    }
  }

  const showMobileActions = isMobile && selectedPart === pid

  return (
    <div>
      <DndDroppable pid={pid} listAtom={partAnswers(pid)} type={pid}>
        {(provided) => (
          <ul
            style={{ paddingLeft: 0 }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {part?.answers?.map((answer, answerIndex) => (
              <DndDraggable
                pid={pid}
                itemId={answer.id || answer._id}
                index={answerIndex}
                key={answer.id || answer._id}
              >
                {(provided, snapshot, lockAxis) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getStyle(provided.draggableProps.style, snapshot, lockAxis)}
                    ref={provided.innerRef}
                  >
                    <AnswerField
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
                      options={multipleOptions}
                      helperText={answer.optional ?? undefined}
                      type={'multiple'}
                    />

                    <Grid container spacing={1} alignItems="flex-start">
                      <Grid item xs={8}>
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
                      <Grid item xs={2}>
                        {answer.image && (
                          <ImageWrapper
                            src={answer.image}
                            onDeleteImage={() =>
                              setPropertyByValue({
                                pid,
                                path: `answers[${answerIndex}].image`,
                              })
                            }
                          />
                        )}
                      </Grid>
                    </Grid>
                  </div>
                )}
              </DndDraggable>
            ))}
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

MultipleInner.propTypes = {
  /** single instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when updating atom's value based on the input path argument */
  setPropertyByValue: PropTypes.func,
  /** Object contains question/answers, each pid correspond to a specific part  */
  part: PropTypes.object.isRequired,
}

MultipleInner.defaultProps = {
  initialList: [''],
}

export { MultipleInner }
