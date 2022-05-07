import React, { useState, createContext } from 'react'
import PropTypes from 'prop-types'
import TextFields from '../short-text/textbox'
import Box from '@material-ui/core/Box'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export const questionContext = createContext({
  markAsDone: null,
})

const Buttons = (props) => {
  const [textboxList, setTextboxList] = useState([
    {
      label: 'First item',
      id: 'Mark',
      sortOrder: 1,
    },
  ])
  const makeId = (length) => {
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
  const moveUp = (index) => {
    // move element up
    let tempList = [...textboxList]
    let tempValue = tempList[index]
    tempList[index] = tempList[index - 1]
    tempList[index - 1] = tempValue
    setTextboxList(tempList)
  }

  const moveDown = (index) => {
    //move the element down
    let tempList = [...textboxList]
    let tempValue = tempList[index]
    tempList[index] = tempList[index + 1]
    tempList[index + 1] = tempValue
    setTextboxList(tempList)
  }

  const handleRemoveClick = (index) => {
    const list = [...textboxList]

    list.splice(index, 1)
    setTextboxList(list)
  }

  const handleAddClick = (index, item) => {
    setTextboxList(
      [...textboxList].concat({
        label: 'New',
        sortOrder: textboxList.length + 1,
        id: makeId(textboxList.length),
      })
    )
  }

  const handleOnDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(textboxList)
    const [reorderItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderItem)

    setTextboxList(items)
  }
  /*
  const [list ,setList] = useState(['a', 'b', 'c'])
  list.map(v => <span>{v}</span>)
  */
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="characters">
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {textboxList.map((item, index) => {
              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <Box border={1} borderColor="blue" display="table">
                      <li
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <TextFields
                          className="characters"
                          onRemoveItem={() => handleRemoveClick(index)}
                          onUpItem={() => moveUp(index)}
                          onDownItem={() => moveDown(index)}
                          onAddItem={() => handleAddClick(index, item)}
                          item={item}
                          id={index}
                          length={textboxList.length}
                          onChange={(index, newValue) => {
                            setTextboxList(
                              textboxList.map((v, i) =>
                                i === index
                                  ? { label: newValue, sortOrder: v.sortOrder }
                                  : v
                              )
                            )
                          }}
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
  )
}

export default Buttons
