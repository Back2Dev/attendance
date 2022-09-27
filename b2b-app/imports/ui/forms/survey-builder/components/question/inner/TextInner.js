import React from 'react'
import PropTypes from 'prop-types'
import { Button, Grid, TextField } from '@material-ui/core'
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

const selector = (answer, answerIndex, pid, setPropertyByValue) => (
  <Grid style={{ marginLeft: '32px' }} item xs={12} md={4} lg={3}>
    <TextField
      id={`${pid}_${answerIndex}`}
      fullWidth
      select
      value={answer.type}
      onChange={({ target: { value } }) =>
        setPropertyByValue({
          pid,
          path: `answers[${answerIndex}].type`,
          value,
        })
      }
      label="Answer Type"
      SelectProps={{
        native: true,
      }}
    >
      {subType.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </TextField>
  </Grid>
)

const getOptions = (textType) => {
  const getExtra = () => {
    switch (textType) {
      case 'password':
        return [{ value: 'confirmPassword', label: 'Confirm Password' }]
      default:
        return []
    }
  }

  return [...textOptions, ...getExtra()]
}

const booleanField = ['optional', 'confirmPassword']

const getHelperText = (answer) => {
  const hasBoolean = Object.entries(answer).filter(
    ([key, value]) => value && booleanField.includes(key)
  )

  if (!hasBoolean.length) return undefined
  const helperText = hasBoolean.map(([key]) => key).join(', ')

  return helperText
}

const filterList = [
  'name',
  'type',
  'image',
  'answers',
  'pid',
  'optional',
  'confirmPassword',
]

const TextInner = ({ pid, question, setPropertyByValue }) => {
  const { add, remove } = usePartAnswers(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const showMobileActions = isMobile && selectedPart === pid
  const theme = useTheme()

  return (
    <div>
      <Droppable droppableId="answer">
        {(provided) => (
          <ul
            style={{ paddingLeft: 0 }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {question?.answers?.map((answer, answerIndex) => {
              return (
                <Draggable draggableId={question.id} index={answerIndex}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      // style={getStyle(provided.draggableProps.style, snapshot, )}
                      ref={provided.innerRef}
                    >
                      <AnswerField
                        underline={true}
                        onRemove={() => remove(answerIndex)}
                        onAdd={() => add(answerIndex)}
                        disableRemove={question.answers.length === 1}
                        setPropertyByValue={setPropertyByValue}
                        pid={pid}
                        answer={answer}
                        answerIndex={answerIndex}
                        showMobileActions={showMobileActions}
                        question={question}
                        pid_index={`${pid}_${answerIndex}`}
                        options={getOptions(answer.type)}
                        type={'text'}
                        helperText={getHelperText(answer)}
                        children={selector(answer, answerIndex, pid, setPropertyByValue)}
                      />

                      <Grid container spacing={1} alignItems="flex-start">
                        <Grid item xs={8}>
                          <OptionField
                            question={question.answers[answerIndex]}
                            filterList={[...filterList]}
                            setPropertyByValue={setPropertyByValue}
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
                </Draggable>
              )
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>

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
  /** single instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when updating atom's value based on the input path argument */
  setPropertyByValue: PropTypes.func,
  /** Object contains question/answers, each pid correspond to a specific part  */
  question: PropTypes.object.isRequired,
}

TextInner.defaultProps = {
  initialList: [''],
}

export { TextInner }
