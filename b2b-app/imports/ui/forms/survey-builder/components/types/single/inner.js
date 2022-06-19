import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useTheme } from '@material-ui/core/styles'
import { Item } from './item'
import {
  useUndefinedAnswers,
  useSelectedPartValue,
  usePartsValue,
  usePartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { DndDraggable, DndDroppable } from '/imports/ui/forms/survey-builder/context/dnd'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { undefinedAnswers } from '/imports/ui/forms/survey-builder/recoil/atoms'

import { makeStyles } from '@material-ui/core/styles'

import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import { singleOptions } from '$sb/components/types/undefined/options'

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

/** Single Choice question */
const SingleInner = ({ pid, part, setPropertyByValue }) => {
  const classes = useStyles()
  const { all, add, update, remove } = useUndefinedAnswers(pid)
  // const [question, setQuestion] = useUndefinedQuestion(pid)
  const theme = useTheme()
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const [isIdChecked, setIsIdChecked] = useState({})
  // const part = usePartValue(pid)
  // const [part] = useRecoilState(getInspectorPart({ pid }))
  // const setPropertyByValue = useRecoilCallback(({ set }) => (path) => {
  //   set(editInspectorState({ pid, path }), (property) => {
  //     if (property === undefined) {
  //       return path.includes('optional') ? true : ''
  //     } else {
  //       return undefined
  //     }
  //   })
  // })

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
                                  <RadioButtonUncheckedIcon />
                                </Grid>
                                <Grid item xs={11}>
                                  <Item
                                    underline={false}
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
                                    options={singleOptions}
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
                                  <RadioButtonUncheckedIcon />
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

SingleInner.propTypes = {
  /** single instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when any choice gets updated */
  onChange: PropTypes.func,
}

SingleInner.defaultProps = {
  initialList: [''],
}

export { SingleInner }

import MoreVertIcon from '@material-ui/icons/MoreVert'

import Menu from '@material-ui/core/Menu'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import { get } from 'lodash'
import { IconButton } from '@material-ui/core'
import { image } from 'd3'

export const MoreList = ({
  part,
  path,
  // setPropertyByValue,
  isIdChecked,
  setIsIdChecked,
  onToggle,
  options = [],
}) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleToggle = (value) => () => {
    if (value.includes('id')) {
      return setIsIdChecked({
        ...isIdChecked,
        [path ?? value]: !isIdChecked[path ?? value],
      })
    }
    onToggle(value)
    // setPropertyByValue({ path: value })
  }

  const fieldOptions = [
    { label: 'ID', value: path ? part[path]?.['_id'] ?? 'id' : 'id' },
    { label: 'Value', value: 'value' },
    ...options,
  ]

  return (
    <>
      <IconButton aria-label="more" size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <List className={classes.list}>
          {fieldOptions.map((item) => {
            const labelId = item.label

            const checked =
              item.label === 'ID'
                ? isIdChecked[path ?? 'id']
                : get(part, path ? `${path}.${item.value}` : item.value)

            return (
              <ListItem
                key={item.value}
                role={undefined}
                dense
                button
                onClick={handleToggle(path ? `${path}.${item.value}` : item.value)}
              >
                <ListItemIcon className={classes.listIcon}>
                  <Checkbox
                    edge="start"
                    checked={Boolean(checked || checked === '')}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={item.label} />
              </ListItem>
            )
          })}
        </List>
      </Menu>
    </>
  )
}
