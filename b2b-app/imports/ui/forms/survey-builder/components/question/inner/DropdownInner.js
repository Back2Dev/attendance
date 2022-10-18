import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import SimpleSchema from 'simpl-schema'
import { Grid, Box, IconButton, TextField, InputAdornment } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import { OptionList } from '$sb/components/question/field/option-list'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { dropdownOptions } from '$sb/components/question/field/options'

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

const dropdownSchema = new SimpleSchema(
  {
    answers: Array,
    'answers.$': Object,
    'answers.$.id': String,
    'answers.$.name': String,
    'answers.$.type': String,
  },
  {
    clean: {
      trimStrings: false,
    },
  }
)

const DropdownInner = ({ question, onAnswerChange }) => {
  const cleanAnswer = dropdownSchema.clean(question).answers
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

DropdownInner.propTypes = {
  question: PropTypes.object.isRequired,
  onAnswerChange: PropTypes.func,
}

export { DropdownInner }

const Answer = ({ answer, onAnswerChange, aIndex, dragHandleProps }) => {
  const classes = useStyles()
  const [showField, setShowField] = useState(() =>
    Object.keys(dropdownOptions).reduce((acc, cur) => {
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
                    options={dropdownOptions}
                    onToggle={onToggle}
                    showField={showField}
                  />
                  {/* <UploadImage {...props} /> */}
                  {/* {specify} */}
                  {/* {createActions(...actions)} */}
                </InputAdornment>
              ),
              // startAdornment: (
              //   <InputAdornment position="start">
              //     <ArrowDropDownIcon />
              //   </InputAdornment>
              // ),
            }}
            label="Answer"
            placeholder="Type some anwer..."
          />
        </Grid>
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
                  label={dropdownOptions[key]}
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
