import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-beautiful-dnd'
import { useRecoilCallback } from 'recoil'
import { singleAnswersState } from '../types/single/inner'

const DndProvider = ({ children }) => {
  const setList = useRecoilCallback(
    ({ set }) => (result) => {
      const { source, destination, draggableId } = result
      if (!destination) return
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return
      }

      // FIXME: convert part ids to strings. remember to update stories too
      let id = draggableId.split('-')[1]
      id = parseInt(id)

      set(singleAnswersState(id), (answers) => {
        const items = Array.from(answers)
        const [reorderedItem] = items.splice(source.index, 1)
        items.splice(destination.index, 0, reorderedItem)
        return items
      })
    },
    []
  )

  const handleDragEnd = (result) => {
    setList(result)
  }

  return <DragDropContext onDragEnd={handleDragEnd}>{children}</DragDropContext>
}

DndProvider.propTypes = {
  children: PropTypes.node,
}

export default DndProvider
