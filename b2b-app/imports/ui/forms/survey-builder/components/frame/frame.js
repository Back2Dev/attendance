import React, { createElement } from 'react'
import PropTypes from 'prop-types'

import debug from 'debug'

import {
  useParts,
  useSelectedPartState,
  useSetDrawer,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context/builder'
import { DndDraggable } from '/imports/ui/forms/survey-builder/context'

import { useTheme } from '@material-ui/styles'
import { MobileFrame } from './mobile'
import { DesktopFrame } from './desktop'
import { useRecoilCallback, useRecoilState } from 'recoil'
import { headerOnly } from '/imports/ui/forms/survey-builder/recoil/atoms'

const log = debug('builder:frame')

const PureFrame = React.forwardRef(
  (
    {
      children,
      onMove,
      onRemove,
      onSelect,
      onDeselect,
      onInspect,
      selected,
      mobile,
      onAdd,
      onCopyPart,
      ...props
    },
    ref
  ) => {
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

    const actions = {
      onRemove,
      onMove,
      onInspect,
      onDeselect: deselectFrame,
      onSelect: selectFrame,
      // onAdd,
      onCopyPart,
    }
    return createElement(
      mobile ? MobileFrame : DesktopFrame,
      { actions, selected, ref, ...props },
      children
    )
  }
)

PureFrame.displayName = 'PureFrame'

PureFrame.propTypes = {
  /** A question type component */
  children: PropTypes.node.isRequired,
  /** Move up/down handler. Receives a direction arg: 'up' | 'down */
  onMove: PropTypes.func,
  /** Remove frame handler */
  onRemove: PropTypes.func,
  /** Handler that gets called with a bool arg. `true` if selected, `false` unselected */
  onSelect: PropTypes.func,
  /** Gets called when inspect button clicked. Mobile only */
  onInspect: PropTypes.func,
  /** Gets called when close button clicked. Mobile only */
  onDeselect: PropTypes.func,
  /** whether frame or children has received focus or been clicked on */
  selected: PropTypes.bool,
  /** whether to show mobile version */
  mobile: PropTypes.bool,
}

const Frame = ({ pid, index, children, ...props }) => {
  const [selectedPart, setSelectedPart] = useSelectedPartState()
  const { removePart, copyPart, addPart } = useParts()

  const { isMobile, dndMove } = useBuilder()
  const setDrawer = useSetDrawer()
  const theme = useTheme()

  const getStyle = (style, snapshot, lockAxis) => {
    if (!snapshot.isDragging) return style
    return {
      ...lockAxis('y', style),
      boxShadow: theme.shadows[6],
      background: theme.palette.background.paper,
    }
  }

  const setHeaderOnly = useRecoilCallback(({ set }) => ({ pid, content }) => {
    set(headerOnly({ pid }), (part) => {
      return { ...content, _id: part._id }
    })
  })

  return (
    <DndDraggable pid={pid} index={index}>
      {(provided, snapshot, lockAxis) => (
        <PureFrame
          selected={selectedPart === pid}
          onSelect={() => setSelectedPart(pid)}
          onRemove={() => {
            removePart(pid)
            setSelectedPart(null)
          }}
          onAddPart={() => addPart(index)}
          onCopyPart={() => copyPart(pid, index)}
          onMove={(e, dir) => dndMove(e, dir)}
          onInspect={() => setDrawer('inspector')}
          onDeselect={() => setSelectedPart(null)}
          ref={provided.innerRef}
          mobile={isMobile}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getStyle(provided.draggableProps.style, snapshot, lockAxis)}
          pid={pid}
          index={index}
          setHeaderOnly={setHeaderOnly}
          {...props}
        >
          {children}
        </PureFrame>
      )}
    </DndDraggable>
  )
}

Frame.displayName = 'Frame'

Frame.propTypes = {
  pid: PropTypes.string,
  children: PropTypes.node,
  index: PropTypes.number,
}

export { Frame, PureFrame }
