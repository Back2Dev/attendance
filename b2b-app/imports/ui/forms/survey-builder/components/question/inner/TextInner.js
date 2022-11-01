import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  MenuItem,
  Grid,
  TextField,
  InputAdornment,
  Box,
  IconButton,
} from '@material-ui/core'
import { textOptions } from '$sb/components/question/field/options'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { OptionList } from '$sb/components/question/field/option-list'
import OptionField from '$sb/components/question/field/option-field'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import { makeStyles } from '@material-ui/core/styles'
import { slugify } from '$sb/utils'
import { RemoveAnsBtn } from '$sb/components/panels/canvas/canvas'
import { Random } from 'meteor/random'

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
      top: '15px',
    },
  },
}))

const subType = [
  { label: 'Short', value: 'text' },
  { label: 'Long', value: 'long' },
  { label: 'Email', value: 'email' },
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' },
  { label: 'Password', value: 'password' },
  { label: 'Address', value: 'address' },
  { label: 'PhoneNumber', value: 'phoneNumber' },
]

const TextInner = ({ question, ...props }) => {
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
                      {...props}
                      aIndex={aIndex}
                      question={question}
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

TextInner.propTypes = {
  question: PropTypes.object.isRequired,
  onQuestionChange: PropTypes.func.isRequired,
}

export { TextInner }

const Answer = ({
  answer,
  onQuestionChange,
  onRemoveAnswer,
  aIndex,
  dragHandleProps,
  question,
  onAddAnswer,
}) => {
  const classes = useStyles()
  const [showField, setShowField] = useState(() =>
    Object.keys(textOptions).reduce((acc, cur) => {
      return {
        ...acc,
        [cur]: false,
      }
    }, {})
  )

  const onToggle = (key) => {
    setShowField({ ...showField, [key]: !showField[key] })
    if (key === 'optional') {
      question.answers[aIndex].optional = !Boolean(question.answers[aIndex].optional)
      onQuestionChange({ question })
    }
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
            id={answer._id}
            fullWidth
            onChange={({ target: { value } }) => {
              question.answers[aIndex].name = value
              question.answers[aIndex].id = slugify(value)
              onQuestionChange({ question })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault()
                onAddAnswer({
                  aIndex,
                  defaultAnswer: {
                    name: 'Type the answer here...',
                    type: 'text',
                  },
                })
              }
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
                    options={textOptions}
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
            }}
            label="Answer"
            placeholder="Type some anwer..."
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <TextField
            fullWidth
            select
            value={answer.type}
            onChange={({ target: { value } }) => {
              question.answers[aIndex].type = value
              onQuestionChange({ question })
            }}
            label="Answer Type"
          >
            {subType.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={1} alignItems="flex-start">
        <Grid item xs={8}>
          <OptionField
            showField={showField}
            answer={answer}
            onQuestionChange={onQuestionChange}
            question={question}
            aIndex={aIndex}
          />
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
