import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, Box, IconButton, TextField, InputAdornment } from '@material-ui/core'
import { multipleOptions } from '$sb/components/question/field/options'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { makeStyles } from '@material-ui/core/styles'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import { OptionList } from '$sb/components/question/field/option-list'
import { slugify } from '$sb/utils'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import { RemoveAnsBtn } from '$sb/components/panels/canvas/canvas'

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

const MultipleInner = ({ question, ...props }) => {
  return (
    <Droppable droppableId={question._id} type={`question-${question._id}`}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {question.answers?.map((answer, aIndex) => {
            return (
              <Draggable draggableId={answer._id} key={answer._id} index={aIndex}>
                {(provided, snapshot) => (
                  <div key={aIndex} {...provided.draggableProps} ref={provided.innerRef}>
                    <Answer
                      dragHandleProps={provided.dragHandleProps}
                      answer={answer}
                      question={question}
                      {...props}
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

MultipleInner.propTypes = {
  question: PropTypes.object.isRequired,
  onQuestionChange: PropTypes.func,
}

export { MultipleInner }

const Answer = ({
  answer,
  question,
  onQuestionChange,
  aIndex,
  dragHandleProps,
  onRemoveAnswer,
}) => {
  const classes = useStyles()
  const [showField, setShowField] = useState(() =>
    Object.keys(multipleOptions).reduce((acc, cur) => {
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
            onChange={({ target: { value } }) => {
              question.answers[aIndex].name = value
              question.answers[aIndex].id = slugify(value)
              onQuestionChange({ question })
            }}
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
                    options={multipleOptions}
                    onToggle={onToggle}
                    showField={showField}
                  />
                  <RemoveAnsBtn
                    onRemoveAnswer={() => onRemoveAnswer({ _id: answer._id })}
                  />
                  {/* <UploadImage {...props} /> */}
                  {/* {specify} */}
                  {/* {createActions(...actions)} */}
                </InputAdornment>
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <CheckBoxOutlineBlankIcon />
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
              onQuestionChange({
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
                  onChange={({ target: { value } }) => {
                    question.answers[aIndex][key] = value
                    onQuestionChange({ question })
                  }}
                  label={multipleOptions[key]}
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
