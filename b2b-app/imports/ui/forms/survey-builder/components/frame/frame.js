import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import debug from 'debug'
import {
  useParts,
  useSelectedPartState,
  useSetDrawer,
  usePartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context/builder'
import { DndDraggable } from '/imports/ui/forms/survey-builder/context'
import {
  Card,
  Box,
  IconButton,
  CardHeader,
  TextField,
  Grid,
  Divider,
} from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { MobileFrame } from './mobile'
import { DesktopFrame } from './desktop'
import { useRecoilCallback } from 'recoil'
import { headerOnly } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import AddIcon from '@material-ui/icons/Add'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import CancelIcon from '@material-ui/icons/Cancel'
import { Question } from '$sb/components/question/field'
import { AddBtn } from '$sb/components/panels/canvas/canvas'

const Frame = ({
  question,
  children,
  qIndex,
  onAddQuestion,
  // isDraggingOver,
  ...props
}) => {
  // const [selectedPart, setSelectedPart] = useSelectedPartState()
  // const { removePart, copyPart, addPart } = useParts()
  const { isMobile, dndMove } = useBuilder()
  // const setDrawer = useSetDrawer()
  const theme = useTheme()

  const getStyle = (style, snapshot, lockAxis) => {
    if (!snapshot.isDragging) return style
    return {
      ...lockAxis('y', style),
      boxShadow: theme.shadows[6],
      background: theme.palette.background.paper,
    }
  }
  const selectFrame = (e) => {
    // already clicked inside or child focussed and relatedTarget (element that blurred) is also a child
    if (
      selected ||
      (e.type === 'focus' &&
        e.currentTarget.contains(e.target) &&
        e.currentTarget.contains(e.relatedTarget))
    ) {
      return
    }

    onSelect?.()
  }

  const deselectFrame = (e) => {
    // already clicked outside or child blurred and relatedTarget (element that got focus) is also a child
    if (
      !selected ||
      (e.type === 'blur' &&
        e.currentTarget.contains(e.target) &&
        !e.currentTarget.contains(e.relatedTarget))
    ) {
      return
    }

    onDeselect?.()
  }

  // const actions = {
  //   onRemove,
  //   onMove,
  //   onInspect,
  //   onDeselect: deselectFrame,
  //   onSelect: selectFrame,
  //   onAdd,
  //   onCopyPart,
  // }

  return (
    // <Draggable draggableId={question.id} key={question.id} index={qIndex}>
    //   {(provided, snapshot) => (
    <Card
    // ref={provided.innerRef}
    // {...provided.draggableProps}
    // {...provided.dragHandleProps}
    >
      {/* {createElement(children, { question, ...props })} */}
      <DesktopFrame question={question} {...props}>
        {children}
      </DesktopFrame>
      {/* {!isDraggingOver && <AddBtn onAdd={() => onAddQuestion()} />} */}
    </Card>

    //   )}
    // </Draggable>
  )
}

Frame.displayName = 'Frame'

Frame.propTypes = {
  // pid: PropTypes.string,
  // children: PropTypes.node,
  // index: PropTypes.number,
}

export { Frame }
