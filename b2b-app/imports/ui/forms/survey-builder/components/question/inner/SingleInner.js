import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Grid,
  Box,
  IconButton,
  TextField,
  InputAdornment,
} from '@material-ui/core'
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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import SimpleSchema from 'simpl-schema'
import { makeStyles } from '@material-ui/core/styles'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import { OptionList } from '$sb/components/question/field/option-list'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
// const filterList = ['name', 'type', 'image', 'answers', 'pid', 'optional', 'specifyType']

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    '& .drag-icon': {
      display: 'none',
    },
    '&:hover .drag-icon': {
      display: 'inline',
      position: 'absolute',
      left: '-15px',
      bottom: '3px',
    },
  },
}))

const singleSchema = new SimpleSchema({
  answers: Array,
  'answers.$': Object,
  'answers.$.id': String,
  'answers.$.name': String,
  'answers.$.type': String,
})

/** Single Choice question */
const SingleInner = ({ question, onAnswerChange }) => {
  const cleanAnswer = singleSchema.clean(question).answers
  // const { add, remove } = usePartAnswers(pid)
  const theme = useTheme()
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  // const [isIdChecked, setIsIdChecked] = useState({})

  // const getStyle = (style, snapshot, lockAxis) => {
  //   if (!snapshot.isDragging) return style
  //   return {
  //     ...lockAxis('y', style),
  //     boxShadow: theme.shadows[3],
  //     background: theme.palette.background.paper,
  //   }
  // }

  // const showMobileActions = isMobile && selectedPart === pid

  return (
    <Droppable droppableId={question.id} type={`question-${question.id}`}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {cleanAnswer?.map((answer, aIndex) => {
            return (
              <Draggable draggableId={answer.id} key={answer.id} index={aIndex}>
                {(provided, snapshot) => (
                  <div key={aIndex} {...provided.draggableProps} ref={provided.innerRef}>
                    <Answer
                      dragHandleProps={provided.dragHandleProps}
                      answer={answer}
                      onAnswerChange={onAnswerChange}
                      aIndex={aIndex}
                    />
                  </div>
                )}
              </Draggable>
            )
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

SingleInner.propTypes = {
  question: PropTypes.object.isRequired,
  onAnswerChange: PropTypes.func,
}

// SingleInner.defaultProps = {
//   initialList: [''],
// }

export { SingleInner }

const Answer = ({ answer, onAnswerChange, aIndex, dragHandleProps }) => {
  const classes = useStyles()
  const [showField, setShowField] = useState(() =>
    Object.keys(singleOptions).reduce((acc, cur) => {
      return {
        ...acc,
        [cur]: false,
      }
    }, {})
  )

  const onToggle = (key) => {
    setShowField({ ...showField, [key]: !showField[key] })
  }

  return (
    <Box className={classes.root}>
      <Grid container spacing={3} alignItems="flex-end">
        <IconButton
          {...dragHandleProps}
          className="drag-icon"
          variant="outlined"
          color="default"
        >
          <DragIndicatorIcon />
        </IconButton>
        <Grid item xs={12} md={9} lg={10}>
          <TextField
            fullWidth
            onChange={({ target: { value } }) =>
              onAnswerChange({ aIndex, key: 'name', value })
            }
            value={answer.name}
            InputProps={{
              // classes: {
              //   underline: classes.hideUnderline,
              // },
              endAdornment: (
                <InputAdornment
                  // classes={{ root: classes.InputAdornment }}
                  position="end"
                >
                  <OptionList
                    options={singleOptions}
                    onToggle={onToggle}
                    showField={showField}
                  />
                  {/* <UploadImage {...props} /> */}
                  {/* {specify} */}
                  {/* {createActions(...actions)} */}
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <RadioButtonUncheckedIcon />
                </InputAdornment>
              ),
            }}
            label="Answer"
            placeholder="Type some anwer..."
          />
        </Grid>
        {/* <Grid item xs={12} md={3} lg={2}>
          <TextField
            fullWidth
            select
            value={answer.type}
            onChange={({ target: { value } }) =>
              onAnswerChange({
                aIndex,
                key: 'type',
                value,
              })
            }
            label="Answer Type"
          >
            {subType.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </TextField>
        </Grid> */}
      </Grid>

      <Grid container spacing={1} alignItems="flex-start">
        <Grid item xs={8}>
          {Object.entries(showField)
            .filter(([_, show]) => show)
            .map(([key]) => {
              return (
                <TextField
                  key={key}
                  fullWidth
                  value={answer[key] || ''}
                  onChange={({ target: { value } }) => onAnswerChange({ key, value })}
                  label={singleOptions[key]}
                />
              )
            })}
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          {/* {answer.image && (
                            <FieldImage
                              src={answer.image}
                              onDeleteImage={() =>
                                setPropertyByValue({
                                  pid,
                                  path: `answers[${aIndex}].image`,
                                })
                              }
                            />
                          )} */}
        </Grid>
      </Grid>
    </Box>
  )
}
