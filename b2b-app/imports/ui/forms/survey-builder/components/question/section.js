import React, { createElement, useState, useContext } from 'react'
import { Box, Fab, IconButton, Paper, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import debug from 'debug'
import { Placeholder } from '/imports/ui/forms/survey-builder/components/old/types'
import {
  usePartsValue,
  useSelectedPartState,
  useSetDrawer,
  useParts,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { partsAtom } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { DndDroppable, useBuilder } from '/imports/ui/forms/survey-builder/context'
import styled from 'styled-components'
import { Question } from '$sb/components/question'
import { ScrollTop } from '/imports/ui/components/scroll-to-top'
import { EditorContext } from '/imports/ui/forms/framework/framework'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Random } from 'meteor/random'

import CancelIcon from '@material-ui/icons/Cancel'

import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import SwapVerticalCircleIcon from '@material-ui/icons/SwapVerticalCircle'
import { AddBtn } from '$sb/components/panels/canvas/canvas'

const Section = React.memo(
  ({
    section,
    onSectionChange,
    sIndex,
    onQuestionChange,
    onAnswerChange,
    onRemoveQuestion,
    onAddQuestion,
  }) => {
    const [sectionCollapse, setSectionCollapse] = useState(false)

    return (
      <Box style={{}}>
        <Box bgcolor="lightgray">
          <IconButton
            style={{ padding: '0.5rem' }}
            aria-label="close"
            onClick={() => onRemoveQuestion()}
          >
            <CancelIcon />
          </IconButton>
          {sectionCollapse ? (
            <IconButton
              style={{ padding: '0.5rem' }}
              aria-label="fold"
              onClick={() => setSectionCollapse(false)}
            >
              <SwapVerticalCircleIcon />
            </IconButton>
          ) : (
            <IconButton
              style={{ padding: '0.5rem' }}
              aria-label="unfold"
              onClick={() => setSectionCollapse(true)}
            >
              <RemoveCircleIcon />
            </IconButton>
          )}
        </Box>
        <Box style={{ padding: '0 0.5rem 1rem 0.5rem', margin: '0.5rem' }}>
          <TextField
            fullWidth
            value={section.name}
            onChange={(e) => {
              onSectionChange({ key: 'name', value: e.target.value })
            }}
          />
        </Box>

        <Droppable key={sIndex} droppableId={`section-${sIndex}`}>
          {(provided) =>
            section.questions.map((question, qIndex) => (
              // <DndDroppable pid="canvas" listAtom={partsAtom} type="canvas">

              <Box
                style={{ padding: '0.5rem', margin: '0.5rem' }}
                key={qIndex}
                // onClick={canvasClicked}
                // {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {createElement(Question || Placeholder, {
                  type: question.type,
                  question,
                  onQuestionChange: ({ key, value }) =>
                    onQuestionChange({ sIndex, qIndex, key, value }),
                  onAnswerChange: ({ aIndex, key, value }) =>
                    onAnswerChange({ sIndex, qIndex, aIndex, key, value }),
                  qIndex,
                  onRemoveQuestion: () => onRemoveQuestion({ sIndex, qIndex }),
                  sectionCollapse,
                })}

                {provided.placeholder}
                <AddBtn onAdd={() => onAddQuestion({ sIndex, qIndex })} />
              </Box>
            ))
          }
        </Droppable>
      </Box>
    )
  }
)

export default Section
