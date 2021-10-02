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
  backgroundColor: theme.palette.background.paper,
  margin: theme.spacing(3, 0, 3, 0),
  padding: theme.spacing(0, 2, 2, 2),
  outline: selected
    ? `1px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.grey['400']}`,
}))

const AButton = styled(Button)({
  minWidth: 'auto',
  padding: 6,
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
  ({ children, selected, actions, ...otherProps }, ref) => {
    const actionTypes = {
      moveUp: {
        icon: KeyboardArrowUpIcon,
        props: {
          onClick: () =>
            actions.onMove({
              dir: 'up',
              draggableId: otherProps['data-rbd-draggable-id'],
            }),
        },
      },
      moveDown: {
        icon: KeyboardArrowDownIcon,
        props: {
          onClick: () =>
            actions.onMove({
              dir: 'down',
              draggableId: otherProps['data-rbd-draggable-id'],
            }),
        },
      },
      inspect: { icon: MoreHorizIcon, props: { onClick: actions.onInspect } },
      remove: { icon: DeleteIcon, props: { onClick: actions.onRemove } },
      deselect: {
        icon: CheckIcon,
        props: { variant: 'contained', onClick: actions.onDeselect },
      },
    }

    const createActions = (...types) => {
      /* Need to wrap AButton in Box because outlined Buttons have transparent background and selected
      box border shows behind it */
      return (
        <ButtonGroup>
          {types.map((type, i) => (
            <Box bgcolor="background.paper" key={i} display="inline-block">
              <AButton
                selected={selected}
                variant={actionTypes[type].props?.variant || 'outlined'}
                color="primary"
                {...actionTypes[type].props}
              >
                {createElement(actionTypes[type].icon)}
              </AButton>
            </Box>
          ))}
        </ButtonGroup>
      )
    }
    // TODO use ToggleButton for deselect
    return (
      <Root onClick={actions.onSelect} selected={selected} {...otherProps} ref={ref}>
        <Fade in={selected}>
          <Actions selected={selected}>
            {createActions('deselect')}
            {createActions('remove')}
            {createActions('moveUp', 'moveDown')}
            {createActions('inspect')}
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
