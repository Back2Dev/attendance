import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import { IconButton, Box } from '@material-ui/core'
import styled from 'styled-components'
import DeleteIcon from '@material-ui/icons/Delete'
import CloseIcon from '@material-ui/icons/Close'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import SettingsIcon from '@material-ui/icons/Settings'
import debug from 'debug'

import { useParts, useSelectedPartState } from './recoil/hooks'
import { useBuilder } from './context/builder'
import { useSetDrawer } from './recoil/hooks/use-drawer'

const log = debug('builder:frame')

const StyledFrame = styled('div')(({ theme, isSelected }) => ({
  padding: theme.spacing(2),
  outline: isSelected
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.grey['400']}`,
  '&:hover': {
    outline: `3px solid ${theme.palette.primary.dark}`,
  },
  margin: theme.spacing(2, 0),
}))

const MobileActionsWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  '& > * + *': {
    marginLeft: theme.spacing(2),
  },
}))

export const PureFrame = React.forwardRef(
  (
    {
      children,
      onMove,
      onRemove,
      onSelect,
      onInspect,
      onDeselect,
      selected,
      mobile,
      ...otherprops
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
      onSelect?.(true)
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
      onSelect?.(false)
    }

    const actionTypes = {
      remove: { icon: DeleteIcon, props: { onClick: onRemove } },
      moveUp: {
        icon: KeyboardArrowUpIcon,
        props: { onClick: () => onMove('up') },
      },
      moveDown: {
        icon: KeyboardArrowDownIcon,
        props: { onClick: () => onMove('down') },
      },
      inspect: { icon: SettingsIcon, props: { onClick: onInspect } },
      close: {
        icon: CloseIcon,
        props: { onClick: onDeselect },
      },
    }

    const createActions = (actions) =>
      actions.map((a, i) => (
        <IconButton size="small" key={i} {...actionTypes[a].props}>
          {createElement(actionTypes[a].icon)}
        </IconButton>
      ))

    return (
      <StyledFrame
        onClick={selectFrame}
        isSelected={selected}
        onFocus={selectFrame}
        onBlur={deselectFrame}
        {...otherprops}
        ref={ref}
      >
        {mobile ? (
          <Box position="relative">
            {!selected && (
              <Box position="absolute" top={0} left={0} bottom={0} right={0} zIndex={1} />
            )}
            {children}
            {selected && (
              <MobileActionsWrapper>
                {createActions(['moveUp', 'moveDown', 'inspect', 'remove', 'close'])}
              </MobileActionsWrapper>
            )}
          </Box>
        ) : (
          <Box display="flex">
            <Box flexGrow={1}>{children}</Box>
            <Box flexGrow={0} display="flex" flexDirection="column">
              {createActions(['remove', 'moveUp', 'moveDown'])}
            </Box>
          </Box>
        )}
      </StyledFrame>
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

const Frame = React.forwardRef(({ pid, children, ...otherprops }, ref) => {
  const [selectedPart, setSelectedPart] = useSelectedPartState()
  const { movePart, removePart } = useParts()
  const { isMobile } = useBuilder()
  const setDrawer = useSetDrawer()

  return (
    <PureFrame
      selected={selectedPart === pid}
      onSelect={(isSelected) => setSelectedPart(isSelected ? pid : null)}
      onRemove={() => {
        removePart(pid)
        setSelectedPart(null)
      }}
      onMove={(dir) => movePart(pid, dir)}
      onInspect={() => setDrawer('inspector')}
      onDeselect={() => setSelectedPart(null)}
      {...otherprops}
      ref={ref}
      mobile={isMobile}
    >
      {children}
    </PureFrame>
  )
})

Frame.displayName = 'Frame'

Frame.propTypes = {
  pid: PropTypes.string,
  children: PropTypes.node,
}

export default Frame
