import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ImageWrapper } from '$sb/components/types/undefined/image'
import AddIcon from '@material-ui/icons/Add'
import { useTheme } from '@material-ui/core/styles'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import { Item } from '$sb/components/types/single/item'
import {
  useUndefinedAnswers,
  useUndefinedQuestion,
  useSelectedPartValue,
} from '$sb/recoil/hooks'
import { undefinedAnswers } from '$sb/recoil/atoms'
import { DndDraggable, DndDroppable } from '$sb/context/dnd'
import { useBuilder } from '$sb/context'
import { Question } from '$sb/components/question'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Grid } from '@material-ui/core'
import { multipleOptions } from '$sb/components/types/undefined/options'
import { AnswerField, OptionField } from '$sb/components/types/undefined/typesField'

const useStyles = makeStyles({
  list: {
    width: '100%',
    maxWidth: 360,
    // backgroundColor: theme.palette.background.paper,
  },
  listIcon: {
    minWidth: '0px',
  },
  gridRoot: {
    flexGrow: 1,
  },
})

const filterList = ['name', 'type', 'image', 'answers']

const MultipleInner = ({ pid, part, setPropertyByValue }) => {
  const { all, add, update, remove } = useUndefinedAnswers(pid)
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
      <DndDroppable pid={pid} listAtom={undefinedAnswers(pid)} type={pid}>
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
                      <Grid item xs={1}>
                        {' '}
                      </Grid>
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
  /** function gets called when any choice gets updated */
  onChange: PropTypes.func,
}

MultipleInner.defaultProps = {
  initialList: [''],
}

export { MultipleInner }
