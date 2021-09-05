import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useRecoilCallback } from 'recoil'
import debug from 'debug'
import { dndAtom } from '../recoil/atoms'
import { useDnd } from '../recoil/hooks'

const log = debug('builder:dnd')

const DndProvider = ({ children }) => {
  const setList = useRecoilCallback(
    ({ set, snapshot }) => (result) => {
      const { source, destination } = result
      if (!destination) return
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return
      }
      const listAtoms = snapshot.getLoadable(dndAtom).contents
      if (!listAtoms.has(source.droppableId)) {
        throw new Error('Cannot find list atom to reorder')
      }
      set(listAtoms.get(source.droppableId), (answers) => {
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

/** Registers a pid to a list atom in addition to rendering a react-beautiful-dnd Droppable */
export const DndDroppable = ({ pid, listAtom, children, ...otherProps }) => {
  useDnd(pid, listAtom)
  return (
    <Droppable droppableId={pid} {...otherProps}>
      {children}
    </Droppable>
  )
}

DndDroppable.propTypes = {
  pid: PropTypes.string,
  listAtom: PropTypes.object,
  children: PropTypes.func,
}

export const DndDraggable = ({ pid, itemId, children, ...otherProps }) => {
  return (
    <Draggable draggableId={`${pid}-${itemId}`} {...otherProps}>
      {children}
    </Draggable>
  )
}

DndDraggable.propTypes = {
  pid: PropTypes.string,
  itemId: PropTypes.string,
  children: PropTypes.func,
}

export default DndProvider
