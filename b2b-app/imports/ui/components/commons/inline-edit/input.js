import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import useKeypress from './useKeypress'
import useOnClickOutside from './useOnClickOutside'

const StyledInlineEdit = styled.span`
  /* these make sure it can work in any text element */
  .inline-text_copy--active,
  .inline-text_input--active {
    font: inherit;
    color: inherit;
    text-align: inherit;
    padding: 0;
    background: none;
    border: none;
    border-bottom: 1px dashed #999999;
    outline: none;
  }

  .inline-text_copy--active {
    cursor: pointer;
  }

  .inline-text_copy--hidden,
  .inline-text_input--hidden {
    display: none;
  }

  .inline-text_input--active {
    border-bottom: 1px solid #666666;
    text-align: left;
  }
`

function InlineEdit({ text, onSetText }) {
  const [isInputActive, setIsInputActive] = useState(false)
  const [inputValue, setInputValue] = useState(text)

  const wrapperRef = useRef(null)
  const textRef = useRef(null)
  const inputRef = useRef(null)

  const enter = useKeypress('Enter')
  const esc = useKeypress('Escape')

  // check to see if the user clicked outside of this component
  useOnClickOutside(wrapperRef, () => {
    if (isInputActive) {
      if (text !== inputValue) {
        onSetText(inputValue)
      }
      setIsInputActive(false)
    }
  })

  const textWidth = useRef(0)
  useEffect(() => {
    if (!isInputActive) {
      // console.log(textRef.current?.offsetWidth)
      textWidth.current = textRef.current?.offsetWidth
      // console.log(textWidth.current)
    }
  }, [isInputActive])

  const onEnter = useCallback(() => {
    if (enter) {
      onSetText(inputValue)
      setIsInputActive(false)
    }
  }, [enter, inputValue, onSetText])

  const onEsc = useCallback(() => {
    if (esc) {
      setInputValue(text)
      setIsInputActive(false)
    }
  }, [esc, text])

  // focus the cursor in the input field on edit start
  useEffect(() => {
    if (isInputActive) {
      inputRef.current.focus()
    }
  }, [isInputActive])

  useEffect(() => {
    if (isInputActive) {
      // if Enter is pressed, save the text and close the editor
      onEnter()
      // if Escape is pressed, revert the text and close the editor
      onEsc()
    }
  }, [onEnter, onEsc, isInputActive]) // watch the Enter and Escape key presses

  const handleSpanClick = useCallback(() => setIsInputActive(true), [setIsInputActive])

  return (
    <StyledInlineEdit className="inline-text" ref={wrapperRef}>
      <span
        ref={textRef}
        onClick={handleSpanClick}
        className={`inline-text_copy inline-text_copy--${
          !isInputActive ? 'active' : 'hidden'
        }`}
      >
        {text}
      </span>
      <input
        ref={inputRef}
        // set the width to the input length multiplied by the x height
        // it's not quite right but gets it close
        style={{
          minWidth: '30px',
          width: `${textWidth.current}px`,
        }}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        className={`inline-text_input inline-text_input--${
          isInputActive ? 'active' : 'hidden'
        }`}
      />
    </StyledInlineEdit>
  )
}

InlineEdit.propTypes = {
  text: PropTypes.string.isRequired,
  onSetText: PropTypes.func.isRequired,
}

export default InlineEdit
