import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import { Button, Box, Fade } from '@material-ui/core'
import styled from 'styled-components'
import CheckIcon from '@material-ui/icons/Check'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import debug from 'debug'

const log = debug('builder:frame')

/* This wrapper exists solely to get around BorderWrapper not supplying a ref prop to the inner DOM
element which we need for DND */
const Root = styled('div')(({ theme, selected }) => ({
  margin: theme.spacing(3, 0, 3, 0),
  padding: theme.spacing(0, 2, 2, 2),
  outline: selected
    ? `1px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.grey['400']}`,
}))

const AButton = styled(Button)({
  minWidth: 'auto',
  padding: 3,
})

const ButtonGroup = styled.div(({ theme }) => ({
  '& > div + div': {
    marginLeft: theme.spacing(1),
  },
}))

const Actions = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  '& > div + div': { marginLeft: theme.spacing(1) },
  position: 'relative',
  top: theme.spacing(-2),
}))

export const MobileFrame = React.forwardRef(
  ({ children, selected, actions, ...otherprops }, ref) => {
    const actionTypes = {
      moveUp: { icon: KeyboardArrowUpIcon, handler: () => actions.onMove('up') },
      moveDown: { icon: KeyboardArrowDownIcon, handler: () => actions.onMove('down') },
      inspect: { icon: MoreHorizIcon, handler: actions.onInspect },
      remove: { icon: DeleteIcon, handler: actions.onRemove },
      deselect: { icon: CheckIcon, handler: actions.onDeselect },
    }

    const createActions = (types, variant = 'outlined') => {
      /* Need to wrap AButton in Box because outlined Buttons have transparent background and selected
      box border shows behind it */
      return (
        <ButtonGroup>
          {types.map((t, i) => (
            <Box bgcolor="background.paper" key={i} display="inline">
              <AButton
                size="small"
                onClick={actionTypes[t].handler}
                selected={selected}
                variant={variant}
                color="primary"
              >
                {createElement(actionTypes[t].icon)}
              </AButton>
            </Box>
          ))}
        </ButtonGroup>
      )
    }

    return (
      <Root onClick={actions.onSelect} selected={selected} {...otherprops} ref={ref}>
        <Fade in={selected}>
          <Actions selected={selected}>
            {createActions(['deselect'], 'contained')}
            {createActions(['remove'])}
            {createActions(['moveUp', 'moveDown'])}
            {createActions(['inspect'])}
          </Actions>
        </Fade>
        <Box position="relative" marginTop={-1.5}>
          {!selected && (
            <Box position="absolute" top={0} left={0} bottom={0} right={0} zIndex={1} />
          )}
          {children}
        </Box>
      </Root>
    )
  }
)

MobileFrame.displayName = 'MobileFrame'

MobileFrame.propTypes = {
  /** A question type component */
  children: PropTypes.node.isRequired,
  /** whether frame or children has received focus or been clicked on */
  selected: PropTypes.bool,
  /** whether to show mobile version */
  mobile: PropTypes.bool,
  /** object of action handlers, eg. onRemove, onAdd, etc */
  actions: PropTypes.objectOf(PropTypes.func),
}

export default MobileFrame
