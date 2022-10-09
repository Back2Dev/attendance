import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Grid, TextField, InputAdornment, Box } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import {
  useSelectedPartValue,
  usePartAnswers,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { textOptions } from '$sb/components/question/field/options'
import { DndDraggable, DndDroppable } from '/imports/ui/forms/survey-builder/context/dnd'
import { useTheme } from '@material-ui/core/styles'
import { partAnswers } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { AnswerField, OptionField } from '$sb/components/question/field'
import { FieldImage } from '$sb/components/question/field'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { OptionList } from '$sb/components/question/field/option-list'
import SimpleSchema from 'simpl-schema'

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

const TextInner = ({ question, onAnswerChange }) => {
  const cleanAnswer = textSchema.clean(question).answers

  return (
    <div>
      <Droppable droppableId="answer">
        {(provided) => (
          <ul
            style={{ paddingLeft: 0 }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cleanAnswer?.map((answer, aIndex) => {
              return (
                <Draggable draggableId={answer.id} key={aIndex} index={aIndex}>
                  {(provided, snapshot) => (
                    <div
                      key={aIndex}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      // style={getStyle(provided.draggableProps.style, snapshot, )}
                      ref={provided.innerRef}
                    >
                      <Answer
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
          </ul>
        )}
      </Droppable>

      {/* {showMobileActions && (
        <Button
          variant="outlined"
          color="default"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => add()}
        >
          New item
        </Button>
      )} */}
    </div>
  )
}

TextInner.propTypes = {
  question: PropTypes.object.isRequired,
  onAnswerChange: PropTypes.func,
}

TextInner.defaultProps = {
  initialList: [''],
}

export { TextInner }

const Answer = ({ answer, onAnswerChange, aIndex }) => {
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
  }

  return (
    <Box>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item xs={12} md={8} lg={9}>
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
                    options={textOptions}
                    onToggle={onToggle}
                    showField={showField}
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
                  label={textOptions[key]}
                  // placeholder="Question"
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
