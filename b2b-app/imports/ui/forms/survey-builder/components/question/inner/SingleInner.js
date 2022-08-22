import React from 'react'
import PropTypes from 'prop-types'
import { Button, Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useTheme } from '@material-ui/core/styles'
import {
  usePartAnswers,
  useSelectedPartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { DndDraggable, DndDroppable } from '/imports/ui/forms/survey-builder/context/dnd'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { partAnswers } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { singleOptions } from '$sb/components/question/field/options'
import { AnswerField, OptionField } from '$sb/components/question/field'
import { FieldImage } from '$sb/components/question/field'

const filterList = ['name', 'type', 'image', 'answers', 'pid', 'optional', 'specifyType']

/** Single Choice question */
const SingleInner = ({ pid, part, setPropertyByValue }) => {
  const { add, remove } = usePartAnswers(pid)
  const theme = useTheme()
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  // const [isIdChecked, setIsIdChecked] = useState({})

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
            {part?.answers?.map((answer, answerIndex) => {
              return (
                <DndDraggable
                  pid={pid}
                  // itemId={answer.id || answer._id}
                  itemId={`${pid}_${answerIndex}`}
                  index={answerIndex}
                  // key={answer.id || answer._id || `${pid}_${answerIndex}`}
                  key={`${pid}_${answerIndex}`}
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
                        pid_index={`${pid}_${answerIndex}`}
                        // isIdChecked={isIdChecked}
                        // setIsIdChecked={setIsIdChecked}
                        options={singleOptions}
                        type={'single'}
                        helperText={answer.optional ?? undefined}
                      />
                      <Grid container spacing={1} alignItems="flex-start">
                        <Grid item xs={8}>
                          <OptionField
                            part={part.answers[answerIndex]}
                            filterList={[...filterList]}
                            setPropertyByValue={setPropertyByValue}
                            // isIdChecked={isIdChecked}
                            // setIsIdChecked={setIsIdChecked}
                            pid_index={`${pid}_${answerIndex}`}
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
                            <FieldImage
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

SingleInner.propTypes = {
  /** single instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when updating atom's value based on the input path argument */
  setPropertyByValue: PropTypes.func,
  /** Object contains question/answers, each pid correspond to a specific part  */
  part: PropTypes.object.isRequired,
}

SingleInner.defaultProps = {
  initialList: [''],
}

export { SingleInner }

// import MoreVertIcon from '@material-ui/icons/MoreVert'

// import Menu from '@material-ui/core/Menu'
// import List from '@material-ui/core/List'
// import ListItem from '@material-ui/core/ListItem'
// import ListItemIcon from '@material-ui/core/ListItemIcon'
// import ListItemText from '@material-ui/core/ListItemText'
// import Checkbox from '@material-ui/core/Checkbox'
// import { get } from 'lodash'
// import { IconButton } from '@material-ui/core'
// import { image } from 'd3'

// export const MoreList = ({
//   part,
//   path,
//   // setPropertyByValue,
//   isIdChecked,
//   setIsIdChecked,
//   onToggle,
//   options = [],
// }) => {
//   const classes = useStyles()
//   const [anchorEl, setAnchorEl] = React.useState(null)

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleClose = () => {
//     setAnchorEl(null)
//   }

//   const handleToggle = (value) => () => {
//     if (value.includes('id')) {
//       return setIsIdChecked({
//         ...isIdChecked,
//         [path ?? value]: !isIdChecked[path ?? value],
//       })
//     }
//     onToggle(value)
//     // setPropertyByValue({ path: value })
//   }

//   const fieldOptions = [
//     { label: 'ID', value: path ? part[path]?.['_id'] ?? 'id' : 'id' },
//     { label: 'Value', value: 'value' },
//     ...options,
//   ]

//   return (
//     <>
//       <IconButton aria-label="more" size="small" onClick={handleClick}>
//         <MoreVertIcon />
//       </IconButton>
//       <Menu
//         id="simple-menu"
//         anchorEl={anchorEl}
//         keepMounted
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//       >
//         <List className={classes.list}>
//           {fieldOptions.map((item) => {
//             const labelId = item.label

//             const checked =
//               item.label === 'ID'
//                 ? isIdChecked[path ?? 'id']
//                 : get(part, path ? `${path}.${item.value}` : item.value)

//             return (
//               <ListItem
//                 key={item.value}
//                 role={undefined}
//                 dense
//                 button
//                 onClick={handleToggle(path ? `${path}.${item.value}` : item.value)}
//               >
//                 <ListItemIcon className={classes.listIcon}>
//                   <Checkbox
//                     edge="start"
//                     checked={Boolean(checked || checked === '')}
//                     tabIndex={-1}
//                     disableRipple
//                     inputProps={{ 'aria-labelledby': labelId }}
//                   />
//                 </ListItemIcon>
//                 <ListItemText id={labelId} primary={item.label} />
//               </ListItem>
//             )
//           })}
//         </List>
//       </Menu>
//     </>
//   )
// }
