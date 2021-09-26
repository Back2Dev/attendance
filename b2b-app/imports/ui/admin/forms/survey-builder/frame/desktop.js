import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import { IconButton, Box } from '@material-ui/core'

import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import CloseIcon from '@material-ui/icons/Close'

import styled from 'styled-components'
import debug from 'debug'

const log = debug('builder:frame')

const borderColor = (theme) =>
  theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'

const Root = styled('div')(({ theme, isSelected }) => ({
  padding: theme.spacing(2),
  outlineStyle: 'solid',
  outlineWidth: 1,
  outlineColor: isSelected ? theme.palette.primary.main : borderColor(theme),
  '&:hover': {
    outlineColor: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
  },
  margin: theme.spacing(2, 0),
}))

export const DesktopFrame = React.forwardRef(
  ({ children, selected, actions, ...otherProps }, ref) => {
    const actionTypes = {
      moveUp: { icon: KeyboardArrowUpIcon, handler: () => actions.onMove('up') },
      moveDown: { icon: KeyboardArrowDownIcon, handler: () => actions.onMove('down') },
      remove: { icon: CloseIcon, handler: actions.onRemove },
    }

    const createActions = (types) =>
      types.map((t, i) => (
        <IconButton size="small" key={i} onClick={actionTypes[t].handler}>
          {createElement(actionTypes[t].icon)}
        </IconButton>
      ))

    return (
      <Root
        onClick={actions.onSelect}
        isSelected={selected}
        onFocus={actions.onSelect}
        onBlur={actions.onDeselect}
        ref={ref}
        {...otherProps}
      >
        <Box display="flex">
          <Box flexGrow={1}>{children}</Box>
          <Box flexGrow={0} display="flex" flexDirection="column">
            {createActions(['remove', 'moveUp', 'moveDown'])}
          </Box>
        </Box>
      </Root>
    )
  }
)

DesktopFrame.displayName = 'DesktopFrame'

DesktopFrame.propTypes = {
  /** A question type component */
  children: PropTypes.node.isRequired,
  /** whether frame or children has received focus or been clicked on */
  selected: PropTypes.bool,
  /** action handlers. eg. onSelect, onRemove, etc */
  actions: PropTypes.objectOf(PropTypes.func),
}

export default DesktopFrame
