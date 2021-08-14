import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ClickAwayListener, IconButton, Box } from '@material-ui/core'
import { styled } from '@material-ui/core/styles'
import { Close, KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons'

const StyledFrame = styled('div')(({ theme, isActive }) => ({
  padding: theme.spacing(2),
  outline: isActive
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.grey['400']}`,
  '&:hover': {
    outline: `3px solid ${theme.palette.primary.light}`,
  },
}))

const Frame = ({ children, onMove, onRemove, onActive, onChange }) => {
  const [isActive, setIsActive] = useState(false)

  const selectFrame = (e) => {
    // already clicked inside or child focussed and relatedTarget (element that blurred) is also a child
    if (
      isActive ||
      (e.type === 'focus' &&
        e.currentTarget.contains(e.target) &&
        e.currentTarget.contains(e.relatedTarget))
    ) {
      return
    }
    setIsActive(true)
    onActive?.(true)
  }

  const deselectFrame = (e) => {
    // already clicked outside or child blurred and relatedTarget (element that got focus) is also a child
    if (
      !isActive ||
      (e.type === 'blur' &&
        e.currentTarget.contains(e.target) &&
        e.currentTarget.contains(e.relatedTarget))
    ) {
      return
    }
    setIsActive(false)
    onActive?.(false)
  }

  return (
    <ClickAwayListener onClickAway={deselectFrame}>
      <StyledFrame
        onClick={selectFrame}
        isActive={isActive}
        onFocus={selectFrame}
        onBlur={deselectFrame}
      >
        <Box display="flex">
          <Box flexGrow={1}>{React.cloneElement(children, { onChange })}</Box>
          <Box flexGrow={0} display="flex" flexDirection="column">
            <IconButton size="small" onClick={onRemove}>
              <Close />
            </IconButton>
            <IconButton size="small" onClick={() => onMove('up')}>
              <KeyboardArrowUp />
            </IconButton>
            <IconButton size="small" onClick={() => onMove('down')}>
              <KeyboardArrowDown />
            </IconButton>
          </Box>
        </Box>
      </StyledFrame>
    </ClickAwayListener>
  )
}

Frame.propTypes = {
  /** A question type component */
  children: PropTypes.node.isRequired,
  /** Move up/down handler. Receives a direction arg: 'up' | 'down */
  onMove: PropTypes.func,
  /** Remove frame handler */
  onRemove: PropTypes.func,
  /** Handler that gets called with a bool arg. `true` if selected, `false` unselected */
  onActive: PropTypes.func,
  /** Handler that gets called whenever question type data changes */
  onChange: PropTypes.func,
}

export default Frame
