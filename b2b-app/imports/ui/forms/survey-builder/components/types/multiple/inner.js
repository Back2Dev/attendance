import React, { useState } from 'react'
import PropTypes from 'prop-types'

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

const getLabelFromKey = (key) => {
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

const MultipleInner = ({ pid, part, setPropertyByValue }) => {
  const { all, add, update, remove } = useUndefinedAnswers(pid)
  const [question, setQuestion] = useUndefinedQuestion(pid)
  const theme = useTheme()
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const classes = useStyles()
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

  console.log(all)

  return (
    <div>
      {/* <Question
        placeholder="Type your question"
        label={question}
        onLabelChange={(text) => setQuestion(text)}
      /> */}
      <DndDroppable pid={pid} listAtom={undefinedAnswers(pid)} type={pid}>
        {(provided) => (
          <ul
            style={{ paddingLeft: 0 }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {all.map((answer, answerIndex) => (
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
                    {Object.entries(answer)
                      .reduce((acc, curr) => {
                        if (curr[0] === 'name') {
                          return [curr, ...acc]
                        }
                        return [...acc, curr]
                      }, [])
                      .map(([key, value]) => {
                        const showField = () => {
                          if (value === undefined) return false

                          const isID = key === 'id' || key === '_id'

                          if (!isID) {
                            return true
                          }

                          if (isID && isIdChecked[`answers[${answerIndex}]`]) {
                            return true
                          }

                          return false
                        }

                        if (key === 'name') {
                          return (
                            <div className={classes.gridRoot} key={key}>
                              <Grid container spacing={1} alignItems="flex-end">
                                <Grid item>
                                  <CheckBoxOutlineBlankIcon />
                                </Grid>
                                <Grid item xs={11}>
                                  <Item
                                    onRemove={() => remove(answerIndex)}
                                    onAdd={() => add(answerIndex)}
                                    disableRemove={all.length === 1}
                                    onChange={({ target: { value } }) =>
                                      setPropertyByValue({
                                        path: `answers[${answerIndex}].name`,
                                        value,
                                        pid,
                                      })
                                    }
                                    onToggle={(path) =>
                                      setPropertyByValue({
                                        path,
                                        pid,
                                      })
                                    }
                                    onUploadFinish={(value) =>
                                      setPropertyByValue({
                                        path: `answers[${answerIndex}].image`,
                                        value,
                                        pid,
                                      })
                                    }
                                    index={`${pid}_${answerIndex}`}
                                    text={value}
                                    showMobileActions={showMobileActions}
                                    placeholder={'Type your answer...'}
                                    actions={['add', 'remove']}
                                    part={part}
                                    isIdChecked={isIdChecked}
                                    setIsIdChecked={setIsIdChecked}
                                    path={`answers[${answerIndex}]`}
                                    showMore={true}
                                    showUploadImage={true}
                                    options={multipleOptions}
                                  />
                                </Grid>
                              </Grid>
                            </div>
                          )
                        } else if (key === 'image') {
                          return (
                            <img
                              src={value}
                              loading="lazy"
                              style={{
                                borderBottomLeftRadius: 4,
                                borderBottomRightRadius: 4,
                                display: 'block',
                                width: '200px',
                              }}
                              key={key}
                            />
                          )
                        } else {
                          return (
                            <div className={classes.gridRoot} key={key}>
                              <Grid
                                container
                                spacing={1}
                                alignItems="flex-end"
                                style={showField() ? {} : { display: 'none' }}
                              >
                                <Grid item style={{ visibility: 'hidden' }}>
                                  <CheckBoxOutlineBlankIcon />
                                </Grid>

                                <Grid item>
                                  <Item
                                    onDeleteOption={() =>
                                      setPropertyByValue({
                                        path: `answers[${answerIndex}].${key}`,
                                      })
                                    }
                                    onChange={({ target: { value } }) =>
                                      setPropertyByValue({
                                        path: `answers[${answerIndex}].${key}`,
                                        value,
                                        pid,
                                      })
                                    }
                                    label={getLabelFromKey(key)}
                                    text={value}
                                    showMobileActions={showMobileActions}
                                    placeholder={key}
                                    actions={['deleteOption']}
                                    path={`answers[${answerIndex}]`}
                                    type={'option'}
                                  />
                                </Grid>
                              </Grid>
                            </div>
                          )
                        }
                      })}
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
