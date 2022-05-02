import React, { useState } from 'react'
import { DndDraggable, DndDroppable } from '$sb/context/dnd'
import { useTheme } from '@material-ui/core/styles'
// import { Box } from '@material-ui/core'
import { useImageAnswers, useQuestion, useSelectedPartValue } from '$sb/recoil/hooks'
import { Item } from './item'
import { useBuilder } from '$sb/context'
import { imageAnswers } from '$sb/recoil/atoms'
import { Question } from '$sb/components/question'

export const InnerImage = ({ pid }) => {
  const { all: imageboxList, add, update, remove } = useImageAnswers(pid)
  const theme = useTheme()
  const [question, setQuestion] = useQuestion(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()

  const getStyle = (style, snapshot, lockAxis) => {
    if (!snapshot.isDragging) return style
    return {
      ...lockAxis('y', style),
      boxShadow: theme.shadows[3],
      background: theme.palette.background.paper,
    }
  }

  const showMobileActions = isMobile && selectedPart === pid

  return (
    <div>
      <Question
        placeholder="Type your question"
        label={question}
        onLabelChange={(text) => setQuestion(text)}
      />
      <DndDroppable pid={pid} listAtom={imageAnswers(pid)} type={pid}>
        {(provided) => (
          <ul
            style={{ paddingLeft: 0 }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {imageboxList.map((item, index) => (
              <DndDraggable pid={pid} key={item.id} itemId={item.id} index={index}>
                {(provided, snapshot, lockAxis) => (
                  <Item
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getStyle(provided.draggableProps.style, snapshot, lockAxis)}
                    ref={provided.innerRef}
                    index={index}
                    item={item}
                    update={update}
                    onRemove={() => remove(index)}
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
