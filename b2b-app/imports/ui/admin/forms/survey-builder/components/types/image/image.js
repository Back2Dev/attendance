
import React, { useState } from 'react'
import { Frame } from '../../frame'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Box } from '@material-ui/core'


export const Image = ({images, pid, index}) => {
  const [imageboxList, setImageboxList] = useState(images)

  const handleOnDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(imageboxList)
    const [reorderItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderItem)

    setImageboxList(items)
  }

  return (
    <Frame pid={pid} index={index}>
      <div><p>Image question type</p>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="images">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {imageboxList.map((item, index) => {
                  return (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <Box border={1} borderColor="blue" display="table">
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <img src={item.img} style={{height:"50px"}}></img>
                          </li>
                        </Box>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </Frame>
  )
}