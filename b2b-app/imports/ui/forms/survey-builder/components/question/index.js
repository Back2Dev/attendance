import React from 'react'
import PropTypes from 'prop-types'
import { Inner } from './inner'
import { Frame } from '$sb/components/frame'
import { DesktopFrame } from '$sb/components/frame/desktop'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import AddIcon from '@material-ui/icons/Add'
import { Box, Fab, IconButton, Paper, TextField } from '@material-ui/core'

const Question = (props) => {
  const { question, qIndex, onAddQuestion, isDraggingOver } = props

  return (
    <Draggable draggableId={question.id} key={question.id} index={qIndex}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <DesktopFrame dragHandleProps={provided.dragHandleProps} {...props}>
            <Inner {...props} />
          </DesktopFrame>

          {!isDraggingOver && (
            <IconButton
              variant="outlined"
              color="default"
              style={{
                background: 'white',
                borderRadius: '10px',
                display: 'block',
                width: '40px',
                boxShadow: '1px 1px 3px lightgray',
                margin: '1rem auto',
              }}
              onClick={() => onAddQuestion()}
            >
              <AddIcon />
            </IconButton>
          )}
        </div>
      )}
    </Draggable>
  )
}

export { Question }
