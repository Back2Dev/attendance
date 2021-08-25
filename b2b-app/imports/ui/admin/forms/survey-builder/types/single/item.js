import React, { forwardRef } from 'react'
import { RadioButtonUnchecked, Delete, DragIndicator, Add } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'
import styled from 'styled-components'

import PropTypes from 'prop-types'

import InlineEdit from '../../inline-edit/edit'

const StyledItem = styled('li')({
  listStyleType: 'none',
  display: 'flex',
  alignItems: 'center',
})

const StyledInlineEdit = styled(InlineEdit)((props) => ({
  marginLeft: props.theme.spacing(2),
}))

const Controls = styled('div')((props) => {
  /**
   * Visually hide an element, but leave it available for screen readers
   * @link https://github.com/h5bp/html5-boilerplate/blob/master/dist/css/main.css
   * @link http://snook.ca/archives/html_and_css/hiding-content-for-accessibility
   */
  const hideVisually = {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  }

  /**
   * Extends the .screen-reader class to allow the element to be focusable when navigated to via the keyboard
   * @link https://github.com/h5bp/html5-boilerplate/blob/master/dist/css/main.css
   * @link https://www.drupal.org/node/897638
   */
  const showVisually = {
    clip: 'auto',
    height: 'auto',
    margin: props.theme.spacing(0, 0, 0, 2),
    overflow: 'visible',
    position: 'static',
    whiteSpace: 'normal',
    width: 'auto',
  }

  /** show on mouse hover and when tabbing. Note: you must import styled from 'styled-components'
   * and not from '@material-ui/core/styles' when referencing components.
   * https://styled-components.com/docs/advanced#referring-to-other-components */
  return {
    ...hideVisually,
    [`${StyledItem}:hover &, &:focus-within`]: showVisually,
    '& svg': {
      verticalAlign: 'middle',
      fill: props.theme.palette.action.active,
    },
  }
})

const DeleteButton = styled(IconButton)((props) => ({
  '&[disabled] svg': {
    fill: props.theme.palette.action.disabled,
  },
}))

/** A radio button with controls to move it up/down and delete. Used by Single component */
const Item = forwardRef(
  (
    { text, placeholder, onTextChange, onRemove, onAdd, disableRemove, ...otherProps },
    ref
  ) => {
    const preventFocus = (e) => {
      // Controls stay visible after user clicks a button and mouse leaves Item. The reason this
      // happens is because Controls uses the 'focus-within' rule to make it visible. This fixes it by
      // preventing focus but still allows tabbing to work correctly.
      e.preventDefault()
    }

    return (
      <StyledItem ref={ref} {...otherProps}>
        <IconButton size="small" disabled>
          <RadioButtonUnchecked />
        </IconButton>
        <StyledInlineEdit
          text={text}
          placeholder={placeholder}
          onTextChange={onTextChange}
        />
        <Controls onMouseDown={preventFocus}>
          <IconButton size="small" onClick={onAdd} aria-label="add">
            <Add />
          </IconButton>
          <DeleteButton
            size="small"
            onClick={onRemove}
            aria-label="delete"
            disabled={disableRemove}
          >
            <Delete />
          </DeleteButton>
          <DragIndicator />
        </Controls>
      </StyledItem>
    )
  }
)

Item.displayName = 'Item'

Item.propTypes = {
  /** Initial text to show */
  text: PropTypes.string,
  /** Show placeholder when `text` content is empty */
  placeholder: PropTypes.string,
  /** function gets called when text field loses focus */
  onTextChange: PropTypes.func,
  /** function gets called when delete button pressed */
  onRemove: PropTypes.func,
  /** function gets called when add button pressed */
  onAdd: PropTypes.func,
  /** disable removing choice */
  disableRemove: PropTypes.bool,
}

Item.defaultProps = {
  placeholder: 'New choice',
}

export default Item
