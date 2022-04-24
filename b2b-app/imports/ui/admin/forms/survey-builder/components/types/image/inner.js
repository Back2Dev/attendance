import React from 'react'
import { DndDraggable, DndDroppable } from '$sb/context/dnd'
// import { Box } from '@material-ui/core'
import { useAnswers, useQuestion, useSelectedPartValue } from '$sb/recoil/hooks'
import { Item } from './item'
import { useBuilder } from '$sb/context'
import { imageAnswers } from '$sb/recoil/atoms'

export const InnerImage = ({ pid }) => {
  const { all: imageboxList, add, update, remove } = useAnswers(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()

  const showMobileActions = isMobile && selectedPart === pid

  return (
    <div>
      <p>Image question type</p>
      <DndDroppable pid={pid} listAtom={imageAnswers(pid)} type={pid}>
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {imageboxList.map((item, index) => (
              <DndDraggable pid={pid} key={item.id} itemId={item.id} index={index}>
                {(provided) => (
                  <Item
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    onRemove={() => remove(index)}
                    onChange={({ target: { files } }) => {
                      if (files && files[0]) {
                        update({ ...item, val: URL.createObjectURL(files[0]) }, index)
                      }
                    }}
                    onAdd={() => add(index)}
                    disableRemove={imageboxList.length === 1}
                    showMobileActions={showMobileActions}
                    val={item.val}
                  />
                )}
              </DndDraggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </DndDroppable>
    </div>
  )
}
