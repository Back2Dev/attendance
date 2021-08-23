import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-beautiful-dnd'
import { selector, useSetRecoilState } from 'recoil'
import { singleState } from '../types/single/single'
import produce from 'immer'

const dndState = selector({
  key: 'dnd',
  set: ({ get, set }, result) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // FIXME: convert part ids to strings. remember to update stories too
    let [key, id] = draggableId.split('-')
    id = parseInt(id)
    const single = get(singleState(id))
    const items = Array.from(single.answers)
    const [reorderedItem] = items.splice(source.index, 1)
    items.splice(destination.index, 0, reorderedItem)

    const nextState = produce(single, (draft) => {
      draft.answers = items
    })
    set(singleState(id), nextState)
  },
})

const DndProvider = ({ children }) => {
  const setList = useSetRecoilState(dndState)

  const handleDragEnd = (result) => {
    setList(result)
  }

  return <DragDropContext onDragEnd={handleDragEnd}>{children}</DragDropContext>
}

DndProvider.propTypes = {
  children: PropTypes.node,
}

export default DndProvider
