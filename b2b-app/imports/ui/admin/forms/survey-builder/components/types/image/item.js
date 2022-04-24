import React, { forwardRef } from 'react'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import DeleteIcon from '@material-ui/icons/Delete'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import AddIcon from '@material-ui/icons/Add'
import { IconButton, Hidden } from '@material-ui/core'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import debug from 'debug'
import { StyledItem, Actions } from '$sb/components/types/single/item'

const Item = forwardRef(
  (
    { onRemove, onAdd, val, showMobileActions, disableRemove, onChange, ...props },
    ref
  ) => {
    const preventFocus = (e) => {
      // Actions stay visible after user clicks a button and mouse leaves Item. The reason this
      // happens is because Actions uses the 'focus-within' rule to make it visible. This fixes it by
      // preventing focus but still allows tabbing to work correctly.
      e.preventDefault()
    }
    const ListStyleType = showMobileActions ? DragHandleIcon : RadioButtonUncheckedIcon

    return (
      <StyledItem ref={ref} {...props}>
        <ListStyleType className="icon" />

        <label htmlFor="file-input">
          <img
            alt=""
            style={{ cursor: 'pointer', width: '150px', height: '150px' }}
            src={val || 'https://picsum.photos/150?grayscale'}
          />
        </label>
        <input
          accept="image/*"
          id="file-input"
          onChange={onChange}
          style={{ display: 'none' }}
          type="file"
        />

        <Actions onMouseDown={preventFocus} showMobileActions={showMobileActions}>
          <Hidden xsDown>
            <DragIndicatorIcon />
            <IconButton size="small" onClick={onAdd} aria-label="add">
              <AddIcon />
            </IconButton>
          </Hidden>

          <IconButton
            className="delete-button"
            size="small"
            onClick={onRemove}
            aria-label="delete"
            disabled={disableRemove}
          >
            <DeleteIcon />
          </IconButton>
        </Actions>
      </StyledItem>
    )
  }
)

Item.displayName = 'ImageItem'

Item.propTypes = {
  /** Initial val to show */
  val: PropTypes.string,
  /** function gets called when text field loses focus */
  onChange: PropTypes.func,
  /** function gets called when delete button pressed */
  onRemove: PropTypes.func,
  /** function gets called when add button pressed */
  onAdd: PropTypes.func,
  /** disable removing choice */
  disableRemove: PropTypes.bool,
  /** whether to show actions for mobile */
  showMobileActions: PropTypes.bool,
}

// Item.defaultProps = {
//   placeholder: 'New choice',
// }

export { Item }
