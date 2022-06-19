import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
// import { Item } from './item'
import { Item } from '$sb/components/types/single/item'
import {
  useTextAnswer,
  useTextQuestion,
  useSelectedPartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { Question } from '/imports/ui/forms/survey-builder/components/question'
import { textOptions } from '$sb/components/types/undefined/options'
import { DndDraggable, DndDroppable } from '/imports/ui/forms/survey-builder/context/dnd'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'

const subType = [
  { label: 'Short', value: 'text' },
  { label: 'Long', value: 'long' },
  { label: 'Email', value: 'email' },
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' },
]

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

const TextInner = ({ pid, part, setPropertyByValue }) => {
  const { all, add, update, remove } = useTextAnswer(pid)
  const [question, setQuestion] = useTextQuestion(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const showMobileActions = isMobile && selectedPart === pid
  const classes = useStyles()
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

                    if (key === 'type') {
                      return
                    }

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
                        <Grid
                          container
                          spacing={1}
                          alignItems="flex-end"
                          // justifyContent="space-around"
                        >
                          <Grid item style={{ visibility: 'hidden' }}>
                            <RadioButtonUncheckedIcon />
                          </Grid>

                          <Grid item xs={2}>
                            <TextField
                              id={`${pid}_${answerIndex}`}
                              fullWidth
                              margin="normal"
                              select
                              value={answer.type}
                              onChange={({ target: { value } }) =>
                                setPropertyByValue({
                                  pid,
                                  path: `answers[${answerIndex}].type`,
                                  value,
                                })
                              }
                              label="Type"
                            >
                              {subType.map(({ value, label }) => (
                                <MenuItem component="div" key={value} value={value}>
                                  {label}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={1}></Grid>
                          <Grid item xs={8}>
                            <Item
                              underline={true}
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
                              options={textOptions}
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

TextInner.propTypes = {
  /** section instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when any choice gets updated */
  onChange: PropTypes.func,
}

TextInner.defaultProps = {
  initialList: [''],
}

export { TextInner }
