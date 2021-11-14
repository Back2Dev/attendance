import React, { useState } from 'react'
import styled from 'styled-components'
import faker from 'faker'

import { Typography } from '@material-ui/core'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const StyledBeautifulDnD = styled.div`
  .item {
    padding: 5px 10px;
    border: 1px solid #cccccc;
    margin: 10px 0;
    display: flex;
    flex-direction: row;

    .drag-handler {
      cursor: move;
      border-right: 1px solid #cccccc;
      padding-right: 10px;
    }
    .content {
      flex: 1;
      padding-left: 10px;
    }
  }
`

const data = []
for (let i = 0; i < 20; i += 1) {
  data.push({
    id: faker.random.alphaNumeric(17),
    text: faker.lorem.words(),
  })
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function BeautifulDnD() {
  const [items, setItems] = useState(data)

  console.log(items)

  const onDragEnd = (result) => {
    console.log('Result', result)
    if (!result.destination) {
      return
    }

    const newItems = reorder(items, result.source.index, result.destination.index)

    setItems(newItems)
  }

  return (
    <StyledBeautifulDnD>
      <Typography variant="h1">BeautifulDnD</Typography>.
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dropable-id">
          {(droppableProvided, droppableSnapshot) => (
            <div
              ref={droppableProvided.innerRef}
              className={`container ${
                droppableSnapshot.isDraggingOver ? 'isDraggingOver' : ''
              }`}
            >
              {items.length &&
                items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(draggableProvided, draggableSnapshot) => (
                      <div
                        className={`item ${
                          draggableSnapshot.isDragging ? 'isDragging' : ''
                        }`}
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                      >
                        <div
                          className="drag-handler"
                          {...draggableProvided.dragHandleProps}
                        >
                          Drag me
                        </div>
                        <div className="content">{item.text}</div>
                      </div>
                    )}
                  </Draggable>
                ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </StyledBeautifulDnD>
  )
}

export default BeautifulDnD
