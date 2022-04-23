
import React from 'react'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { DndDraggable, DndDroppable } from '$sb/context/dnd'
import { Box } from '@material-ui/core'
import { useAnswers, useQuestion, useSelectedPartValue } from '$sb/recoil/hooks'

export const InnerImage = ({ value , pid, index}) => {
  // const [imageboxList, setImageboxList] = useState(value)
  const { all: imageboxList, add, update, remove } = useAnswers(pid)

  const handleOnDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(imageboxList)
    const [reorderItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderItem)

    setImageboxList(items)
  }


  return (
    // <Frame pid={pid} index={index}>
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
                            <label htmlFor="file-input">
                            <img
                              alt=""
                              style={{ cursor: 'pointer', width: '150px', height: '150px' }}
                              src={item.val || 'https://picsum.photos/150?grayscale'}
                            />
                          </label>
                          <input
                            accept="image/*"
                            id="file-input"
                            onChange={({ target: { files } }) => {
                              if (files && files[0]) {
                                update({ ...item, val: URL.createObjectURL(files[0])}, index)
                              }
                            }}
                            style={{ display: 'none' }}
                            type="file"
                          />
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
    // </Frame>
  )
}