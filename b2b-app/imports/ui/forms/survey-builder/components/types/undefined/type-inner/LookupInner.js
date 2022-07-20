import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Grid, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import {
  useSelectedPartValue,
  usePartAnswers,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { textOptions } from '$sb/components/types/undefined/field/options'
import { DndDraggable, DndDroppable } from '/imports/ui/forms/survey-builder/context/dnd'
import { useTheme } from '@material-ui/core/styles'
import { partAnswers } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { AnswerField, OptionField } from '$sb/components/types/undefined/field/typesField'
import { ImageWrapper } from '$sb/components/types/undefined/field/image'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'

const lookupCategories = [
  { label: 'Company', value: 'company' },
  { label: 'Group', value: 'group' },
  { label: 'Title', value: 'title' },
  { label: 'Position', value: 'position' },
  { label: 'Level', value: 'level' },
  { label: 'First Name', value: 'firstname' },
]

const lookupSelector = (answer, answerIndex, pid, setPropertyByValue) => (
  <Fragment>
    <Grid item style={{ visibility: 'hidden' }}>
      <RadioButtonUncheckedIcon />
    </Grid>
    <Grid item xs={3}>
      <TextField
        id={`${pid}_${answerIndex}`}
        fullWidth
        select
        value={answer.lookup}
        onChange={({ target: { value } }) =>
          setPropertyByValue({
            pid,
            path: `answers[${answerIndex}].lookup`,
            value,
          })
        }
        label="Lookup Type"
        SelectProps={{
          native: true,
        }}
      >
        {lookupCategories.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </TextField>
    </Grid>
  </Fragment>
)

const filterList = ['name', 'type', 'image', 'answers', 'pid', 'optional', 'lookup']

const LookupInner = ({ pid, part, setPropertyByValue }) => {
  const { add, remove } = usePartAnswers(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const showMobileActions = isMobile && selectedPart === pid
  const theme = useTheme()

  const getStyle = (style, snapshot, lockAxis) => {
    if (!snapshot.isDragging) return style
    return {
      ...lockAxis('y', style),
      boxShadow: theme.shadows[3],
      background: theme.palette.background.paper,
    }
  }

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
                  itemId={`${pid}_${answerIndex}`}
                  index={answerIndex}
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
                        underline={true}
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
                        options={textOptions}
                        type={'text'}
                        helperText={answer.optional ?? undefined}
                        children={lookupSelector(
                          answer,
                          answerIndex,
                          pid,
                          setPropertyByValue
                        )}
                      />

                      <Grid container spacing={1} alignItems="flex-start">
                        <Grid item xs={8}>
                          <OptionField
                            part={part.answers[answerIndex]}
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
                            <ImageWrapper
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

LookupInner.propTypes = {
  /** single instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when updating atom's value based on the input path argument */
  setPropertyByValue: PropTypes.func,
  /** Object contains question/answers, each pid correspond to a specific part  */
  part: PropTypes.object.isRequired,
}

LookupInner.defaultProps = {
  initialList: [''],
}

export { LookupInner }
