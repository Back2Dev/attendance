import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, Box } from '@material-ui/core'
import styled from 'styled-components'
import { Close, KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons'
import { useParts, useSelectedPartState } from './recoil/hooks'

const StyledFrame = styled('div')(({ theme, isSelected }) => ({
  padding: theme.spacing(2),
  outline: isSelected
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.grey['400']}`,
  '&:hover': {
    outline: `3px solid ${theme.palette.primary.dark}`,
  },
  margin: theme.spacing(2),
}))

export const PureFrame = ({ children, onMove, onRemove, onSelect, selected }) => {
  const selectFrame = (e) => {
    e.stopPropagation()
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
    e.stopPropagation()
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

  return (
    <StyledFrame
      onClick={selectFrame}
      isSelected={selected}
      onFocus={selectFrame}
      onBlur={deselectFrame}
    >
      <Box display="flex">
        <Box flexGrow={1}>{children}</Box>
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
  )
}

PureFrame.propTypes = {
  /** A question type component */
  children: PropTypes.node.isRequired,
  /** Move up/down handler. Receives a direction arg: 'up' | 'down */
  onMove: PropTypes.func,
  /** Remove frame handler */
  onRemove: PropTypes.func,
  /** Handler that gets called with a bool arg. `true` if selected, `false` unselected */
  onSelect: PropTypes.func,
  /** whether frame or children has received focus or been clicked on */
  selected: PropTypes.bool,
}

const Frame = ({ pid, children }) => {
  const [selectedPart, setSelectedPart] = useSelectedPartState()
  const { movePart, removePart } = useParts()
  return (
    <PureFrame
      selected={selectedPart === pid}
      onSelect={(isSelected) => setSelectedPart(isSelected ? pid : null)}
      onRemove={() => {
        removePart(pid)
        setSelectedPart(null)
      }}
      onMove={(dir) => movePart(pid, dir)}
    >
      {children}
    </PureFrame>
  )
}

Frame.propTypes = {
  pid: PropTypes.string,
  children: PropTypes.node,
}

export default Frame
