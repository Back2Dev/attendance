import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useRecoilCallback } from 'recoil'
import debug from 'debug'
import { dndAtom } from '../recoil/atoms'
import { useDnd } from '../recoil/hooks'
import { useDndSensor } from '../hooks'

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
        log('dndAtom', listAtoms)
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

  return (
    <DragDropContext sensors={[useDndSensor]} onDragEnd={handleDragEnd}>
      {children}
    </DragDropContext>
  )
}

DndProvider.propTypes = {
  children: PropTypes.node,
}

/** Registers a pid to a list atom in addition to rendering a react-beautiful-dnd Droppable */
const DndDroppable = ({ pid, listAtom, children, ...otherProps }) => {
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

const DndDraggable = ({ pid, itemId, children, ...otherProps }) => {
  /* locks dragging to Y axis only */
  function lockAxis(axis, style) {
    if (style?.transform) {
      let transform = style.transform
      let [tx, ty] = style.transform.split(',')

      if (axis.toLowerCase() === 'y') {
        transform = `translate(0px, ${ty}`
      } else {
        transform = `${tx}, 0px)`
      }
      return {
        ...style,
        transform,
      }
    }
    return style
  }
  return (
    <Draggable draggableId={`${pid}-${itemId}`} {...otherProps}>
      {(provided, snapshot) => children(provided, snapshot, lockAxis)}
    </Draggable>
  )
}

DndDraggable.propTypes = {
  pid: PropTypes.string,
  itemId: PropTypes.string,
  children: PropTypes.func,
}

export { DndProvider, DndDroppable, DndDraggable }
