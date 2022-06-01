import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import ContentEditable from 'react-contenteditable'
import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles'

import { useRefCallback, useDidMountEffect } from '/imports/ui/forms/survey-builder/hooks'

const useStyles = makeStyles((theme) => ({
  /* apply a wrapping root div to fix webkit browser issue where clicking outside a contenteditable
       will focus the element
       https://stackoverflow.com/questions/34354085/clicking-outside-a-contenteditable-div-stills-give-focus-to-it
     */
  root: {
    [theme.breakpoints.up('sm')]: {
      '&:hover': { outline: `1px solid ${theme.palette.divider}` },
    },
  },
  edit: {
    ...theme.typography.body1,

    cursor: 'text',
    '&:focus': {
      outline: `1px solid ${theme.palette.primary.light}`,
    },
    '&:empty::before': {
      content: (props) => `"${props.placeholder}"`,
      opacity: theme.palette.type === 'light' ? 0.42 : 0.5,
    },
  },
}))

// TODO tabbing should either select all text or put cursor at end. currently goes to start
// TODO paste text only and undo
// TODO sanitise string against XSS attacks

/** Inline editable text field that shows a label but can be modified like an input text element.
 * Commits values on enter/tab key and reverts back to original value on escape
 */
const Edit = ({
  placeholder,
  text,
  onTextChange,
  className,
  onAdd,
  pid,
  index,
  fieldStyle,
  ...otherProps
}) => {
  const classes = useStyles({ placeholder })
  /** stores the value before user begins typing so that if user presses escape, it reverts back to this value */
  const [lastVal, setLastVal] = useState(null)
  /** stores the text typed into the contenteditable */
  const [val, setVal] = useState(text)
  const [isEditing, setIsEditing] = useState(false)
  const editEl = useRef(null)
  const [lastText, setLastText] = useState(null)

  /* deriving val state from text prop so we need to check if text prop changes then force a re-render
     whenever it changes */
  if (lastText !== text) {
    setVal(text)
    setLastText(text)
  }

  useDidMountEffect(() => {
    if (isEditing && editEl?.current) {
      editEl.current.focus()
    } else if (!isEditing && editEl?.current) {
      lastVal !== val && onTextChange?.(val)
      editEl.current.blur()
    }
  }, [isEditing, editEl])

  const activateView = useRefCallback((e) => {
    e.preventDefault()
    setIsEditing(false)
  }, [])

  const onKeyDown = useRefCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        setIsEditing(false)
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setVal(lastVal)
        setIsEditing(false)
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        if (!onAdd) {
          return
        }
        onAdd()
        //setTimeout to wait elemetent to be created
        setTimeout(
          () => document.querySelectorAll(`[id ^='${pid}']`)[index + 1].focus(),
          0
        )
      }
    },
    [placeholder, lastVal]
  )

  const activateEdit = useRefCallback((e) => {
    setIsEditing(true)
    setLastVal(e.currentTarget.innerText)
  }, [])

  const changeText = useRefCallback((e) => {
    setVal(e.target.value)
  }, [])

  const pasteText = (e) => {
    e.preventDefault()
    setVal(e.clipboardData.getData('text'))
  }

  return (
    <div className={clsx(classes.root, className)} {...otherProps}>
      <ContentEditable
        tabIndex="0"
        id={`${pid}_${Date.now()}`}
        innerRef={editEl}
        className={classes.edit}
        html={val}
        onChange={changeText}
        onKeyDown={onKeyDown}
        onBlur={activateView}
        onFocus={activateEdit}
        onPaste={pasteText}
        spellCheck="false"
        role={isEditing ? 'textbox' : 'button'}
        aria-label={placeholder}
        style={fieldStyle}
      />
    </div>
  )
}

Edit.propTypes = {
  /** initial text to show, defaults to empty string */
  text: PropTypes.string,
  /** shows this text when text is blank */
  placeholder: PropTypes.string.isRequired,
  /** function gets called when editable field loses focus */
  onTextChange: PropTypes.func,
  /** custom styling */
  className: PropTypes.string,
}

Edit.defaultProps = {
  text: '',
}

export { Edit as InlineEdit }
