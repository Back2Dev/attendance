import React, { useState } from 'react'
import {
  Box,
  CardHeader,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
} from '@material-ui/core'
import { Question } from '$sb/components/question'
import { Droppable } from 'react-beautiful-dnd'
import CancelIcon from '@material-ui/icons/Cancel'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import { sectionOptions } from '$sb/components/question/field/options'
import { OptionList } from '$sb/components/question/field/option-list'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { Random } from 'meteor/random'
import { slugify } from '$sb/utils'

const Section = React.memo(
  ({
    section,
    onSectionChange,
    sIndex,
    onQuestionChange,
    onRemoveQuestion,
    onRemoveSection,
    onRemoveAnswer,
    onAddQuestion,
    onMove,
    onAddAnswer,
    onAddGrid,
  }) => {
    const [sectionCollapse, setSectionCollapse] = useState(false)
    const [showField, setShowField] = useState(() =>
      Object.keys(sectionOptions).reduce((acc, cur) => {
        return {
          ...acc,
          [cur]: false,
        }
      }, {})
    )

    const onToggle = (key) => {
      // setShowField((prev) => {
      //   prev[key] = !prev[key]
      //   console.log(prev)
      //   return prev
      // })
      setShowField({ ...showField, [key]: !showField[key] })
    }

    return (
      <Box>
        <CardHeader
          style={{ background: 'lightgray', padding: '0.3rem' }}
          avatar={
            <Box>
              <IconButton
                style={{ padding: '0.3rem' }}
                aria-label="close"
                onClick={() => onRemoveSection({ _id: section._id })}
              >
                <CancelIcon />
              </IconButton>
              {sectionCollapse ? (
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="fold"
                  onClick={() => setSectionCollapse(false)}
                >
                  <SwapVerticalCircleIcon />
                </IconButton>
              ) : (
                <IconButton
                  style={{ padding: '0.3rem' }}
                  aria-label="unfold"
                  onClick={() => setSectionCollapse(true)}
                >
                  <RemoveCircleIcon />
                </IconButton>
              )}
              <IconButton
                style={{ padding: '0.5rem' }}
                aria-label="add-question"
                onClick={() => onAddQuestion({ qIndex: section.questions.length - 1 })}
              >
                <AddCircleIcon />
              </IconButton>
            </Box>
          }
        />

        <Box style={{ padding: '0 0.5rem 1rem 0.5rem', margin: '0.5rem' }}>
          <TextField
            fullWidth
            value={section.name}
            onChange={({ target: { value } }) => {
              section.name = value
              section.id = slugify(value)
              onSectionChange({ section })
            }}
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
                    options={sectionOptions}
                    onToggle={onToggle}
                    showField={showField}
                  />
                  {/* <UploadImage {...props} /> */}
                  {/* {specify} */}
                  {/* {createActions(...actions)} */}
                </InputAdornment>
              ),
            }}
          />

          {/* Options */}
          <Grid container spacing={3} alignItems="flex-end">
            {Object.entries(showField)
              .filter(([_, show]) => show)
              .map(([key]) => {
                return (
                  <Grid item xs={12} md={9} lg={10} key={key}>
                    <TextField
                      key={key}
                      fullWidth
                      value={section[key] || ''}
                      onChange={({ target: { value } }) =>
                        // onSectionChange({ key, value, section })
                        {
                          section[key] = value
                          onSectionChange({ section })
                        }
                      }
                      label={sectionOptions[key]}
                    />
                  </Grid>
                )
              })}

            <Grid item xs={2}>
              {/* {part.image && (
              <FieldImage
                src={part.image}
                onDeleteImage={() =>
                  setPropertyByValue({
                    pid,
                    path: 'image',
                  })
                }
              />
            )} */}
            </Grid>
          </Grid>
        </Box>

        {/*DnD Question */}
        <Droppable key={sIndex} droppableId={section._id} type={`section-${section._id}`}>
          {(provided, snapshot) => (
            <div
              style={{
                padding: '0.5rem',
                margin: '0.5rem',
              }}
              key={section._id}
              ref={provided.innerRef}
            >
              {section.questions.map((question, qIndex) => {
                //data from text editor may not have this property
                // if (!question._id) question._id = Random.id()
                const questionProps = {
                  type: question.type,
                  question,
                  onQuestionChange,
                  qIndex,
                  onRemoveAnswer,
                  onRemoveQuestion,
                  sectionCollapse,
                  onAddQuestion: () => onAddQuestion({ sIndex, qIndex }),
                  onAddAnswer: ({ aIndex, defaultAnswer }) =>
                    onAddAnswer({ sIndex, qIndex, aIndex, defaultAnswer }),
                  onAddGrid: ({ aIndex, defaultGrid, type }) =>
                    onAddGrid({ sIndex, qIndex, aIndex, defaultGrid, type }),
                  isDraggingOver: snapshot.isDraggingOver,
                  onCopyQuestion: () => onAddQuestion({ sIndex, qIndex, question }),
                  onMoveUp: () => onMove({ dir: 'up', draggableId: question._id }),
                  onMoveDown: () => onMove({ dir: 'down', draggableId: question._id }),
                  moveUpDisabled: qIndex === 0,
                  moveDownDisabled: qIndex === section.questions.length - 1,
                }
                return <Question key={question._id} {...questionProps} />
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Box>
    )
  }
)

export default Section
