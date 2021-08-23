import React, { useState, createContext } from 'react'
import PropTypes from 'prop-types'
import TextFields from '../short text question/textbox'
import Box from '@material-ui/core/Box'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export const QuestionContext = createContext({
  markAsDone: null,
})

const Buttons = (props) => {
  const [textboxList, setTextboxList] = useState([
    {
      label: 'First item',
      id: 'Mark',
      sortOrder: 1,
    },
    {
      label: 'Second item',
      id: 'Tom',
      sortOrder: 2,
    },
    {
      label: 'Third item',
      id: 'Jerry',
      sortOrder: 3,
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
    // let tempList = JSON.parse(JSON.stringify(textboxList))
    let tempValue = tempList[index]
    tempList[index] = tempList[index - 1]
    tempList[index - 1] = tempValue
    setTextboxList(tempList)
  }

  const moveDown = (index) => {
    //move the element down
    let tempList = [...textboxList]
    // let tempList = JSON.parse(JSON.stringify(textboxList))
    let tempValue = tempList[index]
    tempList[index] = tempList[index + 1]
    tempList[index + 1] = tempValue
    setTextboxList(tempList)
  }

  const handleRemoveClick = (index) => {
    // let tempList = JSON.parse(JSON.stringify(textboxList))
    let tempList = [...textboxList]
    tempList.splice(index, 1)
    setTextboxList(tempList)
  }

  const handleAddClick = (index, item) => {
    // let tempList = JSON.parse(JSON.stringify(textboxList))
    let tempList = [...textboxList]
    setTextboxList(
      tempList.concat({
        label: 'New',
        sortOrder: tempList.length + 1,
        id: makeId(tempList.length),
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
                    <Box border={1} borderColor="blue" display="flex">
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
                                  ? {
                                      label: newValue,
                                      sortOrder: v.sortOrder,
                                      id: v.id,
                                    }
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
