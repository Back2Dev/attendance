import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import {
  Checkbox,
  ListItem,
  ListItemIcon,
  Typography,
  ListItemText,
} from '@material-ui/core'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'

const StyledListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}))

const EditItem = forwardRef(({ pid, type, atom, onSelect, ...otherProps }, ref) => {
  // TODO: edit items currently expects a 'prompt' key to exist in the atom state.
  // This is the question title which renders for each item on the edit screen.
  const { prompt } = useRecoilValue(atom(pid))

  const title = prompt.length > 80 ? prompt.slice(0, 80) + '...' : prompt

  return (
    <StyledListItem ref={ref} {...otherProps}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          tabIndex={-1}
          disableRipple
          onChange={(e) => onSelect(e.target.checked)}
        />
      </ListItemIcon>
      <ListItemText
        primary={<Typography variant="caption">{title}</Typography>}
        secondary={`Type: ${type} - Id: ${pid}`}
      />
      <DragIndicatorIcon />
    </StyledListItem>
  )
})

EditItem.propTypes = {
  pid: PropTypes.string,
  type: PropTypes.string,
  onSelect: PropTypes.func,
  atom: PropTypes.func,
}

EditItem.displayName = 'EditItem'

export { EditItem }
