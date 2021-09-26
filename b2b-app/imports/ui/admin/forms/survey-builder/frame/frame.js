import React, { createElement } from 'react'
import PropTypes from 'prop-types'

import debug from 'debug'

import { useParts, useSelectedPartState, useSetDrawer } from '../recoil/hooks'
import { useBuilder } from '../context/builder'
import { DndDraggable } from '../context'

import MobileFrame from './mobile'
import DesktopFrame from './desktop'

const log = debug('builder:frame')

export const PureFrame = React.forwardRef(
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
      ...otherProps
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
          e.currentTarget.contains(e.relatedTarget))
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
    }
    return createElement(
      mobile ? MobileFrame : DesktopFrame,
      { actions, selected, ref, ...otherProps },
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

const Frame = ({ pid, index, children }) => {
  const [selectedPart, setSelectedPart] = useSelectedPartState()
  const { movePart, removePart } = useParts()
  const { isMobile } = useBuilder()
  const setDrawer = useSetDrawer()

  return (
    <DndDraggable pid={pid} itemId={index.toString()} index={index}>
      {(provided) => (
        <PureFrame
          selected={selectedPart === pid}
          onSelect={() => setSelectedPart(pid)}
          onRemove={() => {
            removePart(pid)
            setSelectedPart(null)
          }}
          onMove={(dir) => {
            movePart(pid, dir)
          }}
          onInspect={() => setDrawer('inspector')}
          onDeselect={() => setSelectedPart(null)}
          ref={provided.innerRef}
          mobile={isMobile}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
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

export default Frame
