import React, { createElement, useState, useContext } from 'react'
import {
  Box,
  CardHeader,
  Card,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  Grid,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'

import { Placeholder } from '/imports/ui/forms/survey-builder/components/old/types'

import { Question } from '$sb/components/question'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import CancelIcon from '@material-ui/icons/Cancel'

import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import { AddBtn } from '$sb/components/panels/canvas/canvas'
import { Inner } from '$sb/components/question/inner/inner'
import { Frame } from '$sb/components/frame'
import { sectionOptions } from '$sb/components/question/field/options'
import { OptionList } from '$sb/components/question/field/option-list'
import AddCircleIcon from '@material-ui/icons/AddCircle'

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  padding: 8,
  // width: 500
})

const Section = React.memo(
  ({
    section,
    onSectionChange,
    sIndex,
    onQuestionChange,
    onAnswerChange,
    onRemoveQuestion,
    onAddQuestion,
    onMove,
    onAddAnswer,
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
                onClick={() => onRemoveQuestion()}
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
            onChange={(e) => {
              onSectionChange({ key: 'name', value: e.target.value })
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
          <Grid container spacing={1} alignItems="flex-start">
            {Object.entries(showField)
              .filter(([_, show]) => show)
              .map(([key]) => {
                return (
                  <TextField
                    key={key}
                    fullWidth
                    value={section[key] || ''}
                    onChange={({ target: { value } }) => onSectionChange({ key, value })}
                    label={sectionOptions[key]}
                    // placeholder="Question"
                  />
                )
              })}
            <Grid item xs={1}></Grid>
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
        <Droppable key={sIndex} droppableId={section.id} type={`section-${section.id}`}>
          {
            (provided, snapshot) => (
              <div
                style={{
                  padding: '0.5rem',
                  margin: '0.5rem',
                }}
                key={section.id}
                ref={provided.innerRef}
              >
                {section.questions.map((question, qIndex) => {
                  const questionProps = {
                    type: question.type,
                    question,
                    onQuestionChange: ({ key, value }) =>
                      onQuestionChange({ sIndex, qIndex, key, value }),
                    onAnswerChange: ({ aIndex, key, value }) =>
                      onAnswerChange({ sIndex, qIndex, aIndex, key, value }),
                    qIndex,
                    onRemoveQuestion: () => onRemoveQuestion({ sIndex, qIndex }),
                    sectionCollapse,
                    onAddQuestion: () => onAddQuestion({ sIndex, qIndex }),
                    onAddAnswer: ({ aIndex, defaultAnswer }) =>
                      onAddAnswer({ sIndex, qIndex, aIndex, defaultAnswer }),
                    isDraggingOver: snapshot.isDraggingOver,
                    onCopyQuestion: () => onAddQuestion({ sIndex, qIndex, question }),
                    onMoveUp: () => onMove({ dir: 'up', draggableId: question.id }),
                    onMoveDown: () => onMove({ dir: 'down', draggableId: question.id }),
                    moveUpDisabled: qIndex === 0,
                    moveDownDisabled: qIndex === section.questions.length - 1,
                  }
                  return <Question key={question.id} {...questionProps} />
                })}
                {provided.placeholder}
              </div>
            )

            // (provided, snapshot) =>
            //   section.questions.map((question, qIndex) => {
            //     const questionProps = {
            //       type: question.type,
            //       question,
            //       onQuestionChange: ({ key, value }) =>
            //         onQuestionChange({ sIndex, qIndex, key, value }),
            //       onAnswerChange: ({ aIndex, key, value }) =>
            //         onAnswerChange({ sIndex, qIndex, aIndex, key, value }),
            //       qIndex,
            //       onRemoveQuestion: () => onRemoveQuestion({ sIndex, qIndex }),
            //       sectionCollapse,
            //       onAddQuestion: () => onAddQuestion({ sIndex, qIndex }),
            //       isDraggingOver: snapshot.isDraggingOver,
            //     }

            //     return (
            //       <div
            //         style={{
            //           ...getListStyle(snapshot.isDraggingOver),
            //           padding: '0.5rem',
            //           margin: '0.5rem',
            //         }}
            //         key={question.id}
            //         ref={provided.innerRef}
            //       >
            //         <Draggable draggableId={question.id} key={question.id} index={qIndex}>
            //           {(provided, snapshot) => (
            //             <div
            //               ref={provided.innerRef}
            //               {...provided.draggableProps}
            //               {...provided.dragHandleProps}
            //             >
            //               <Question {...questionProps} />
            //               {/* <DesktopFrame question={question} {...props}>
            //               {children}
            //             </DesktopFrame> */}
            //             </div>
            //           )}
            //         </Draggable>
            //           {/* {createElement(Question || Placeholder, {
            //           type: question.type,
            //           question,
            //           onQuestionChange: ({ key, value }) =>
            //             onQuestionChange({ sIndex, qIndex, key, value }),
            //           onAnswerChange: ({ aIndex, key, value }) =>
            //             onAnswerChange({ sIndex, qIndex, aIndex, key, value }),
            //           qIndex,
            //           onRemoveQuestion: () => onRemoveQuestion({ sIndex, qIndex }),
            //           sectionCollapse,
            //           onAddQuestion: () => onAddQuestion({ sIndex, qIndex }),
            //         })} */}

            //           {/* <AddBtn onAdd={() => onAddQuestion({ sIndex, qIndex })} /> */}
            //         {provided.placeholder}
            //       </div>
            //     )
            //   })
          }
        </Droppable>
      </Box>
    )
  }
)

export default Section
