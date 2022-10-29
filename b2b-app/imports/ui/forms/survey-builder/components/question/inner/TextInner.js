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
import SimpleSchema from 'simpl-schema'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import { makeStyles } from '@material-ui/core/styles'
import { slugify } from '$sb/utils'
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

const textSchema = new SimpleSchema({
  answers: Array,
  'answers.$': Object,
  'answers.$.id': String,
  'answers.$.name': String,
  'answers.$.type': String,
})

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
      console.log(question.answers[aIndex])
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
          {Object.entries(showField)
            .filter(([_, show]) => show)

            .map(([key]) => {
              switch (typeof question[key]) {
                case 'boolean':
                  return (
                    <Grid item xs={12} md={9} lg={10} key={key}>
                      <TextField
                        fullWidth
                        size="small"
                        margin="dense"
                        select
                        value={answer[key] || false}
                        onChange={({ target: { value } }) => {
                          question.answers[aIndex].value = !Boolean(
                            question.answers[aIndex].value
                          )

                          onQuestionChange({ question })
                        }}
                        label={questionOptions[key]}
                      >
                        <MenuItem key={'true'} value={true}>
                          True
                        </MenuItem>
                        <MenuItem key={'false'} value={false}>
                          False
                        </MenuItem>
                      </TextField>
                    </Grid>
                  )
                default:
                  return (
                    <Grid item xs={12} md={9} lg={10} key={key}>
                      <TextField
                        fullWidth
                        value={answer[key] || ''}
                        onChange={({ target: { value } }) => {
                          if (key === 'optional') {
                            question.answers[aIndex].optional = !Boolean(
                              question.answers[aIndex].optional
                            )
                          } else {
                            question.answers[aIndex][key] = value
                          }

                          onQuestionChange({ question })
                        }}
                        label={textOptions[key]}
                      />
                    </Grid>
                  )
              }

              // return (
              //   <TextField
              //     key={key}
              //     fullWidth
              //     value={answer[key] || ''}
              //     onChange={({ target: { value } }) => {
              //       if (key === 'optional') {
              //         question.answers[aIndex].optional = !Boolean(
              //           question.answers[aIndex].optional
              //         )
              //       } else {
              //         question.answers[aIndex][key] = value
              //       }

              //       onQuestionChange({ question })
              //     }}
              //     label={textOptions[key]}
              //   />
              // )
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
