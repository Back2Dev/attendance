import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import useKeypress from './useKeypress'
import useOnClickOutside from './useOnClickOutside'

const StyledInlineEdit = styled.span`
  /* these make sure it can work in any text element */
  .inline-text_copy,
  .inline-text_input {
    font: inherit;
    color: inherit;
    text-align: inherit;
    padding: 0;
    background: none;
    border: none;
    outline: none;
  }

  .inline-text_copy {
    cursor: pointer;
    border-bottom: 1px dashed #999999;
  }

  .inline-text_input {
    border-bottom: 1px solid #666666;
    text-align: left;
    overflow: hidden;
    min-width: 30px;
  }
`

function InlineEdit({ text = '', onSetText, placeholder = '' }) {
  const [isInputActive, setIsInputActive] = useState(false)
  const [inputValue, setInputValue] = useState(text)

  const wrapperRef = useRef(null)
  const textRef = useRef(null)
  const inputRef = useRef(null)

  const enter = useKeypress('Enter')
  const esc = useKeypress('Escape')

  // update the inputValue state on text prop changed
  useEffect(() => {
    setInputValue(text || '')
  }, [text])

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
  const textHeight = useRef(0)
  useEffect(() => {
    if (!isInputActive) {
      // console.log(textRef.current)
      setTimeout(() => {
        textWidth.current = textRef.current?.offsetWidth
        textHeight.current = textRef.current?.offsetHeight
        // console.log(textWidth.current, textHeight.current)
      }, 200)
    }
  }, [isInputActive, inputValue])

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

  const renderText = () => {
    if (isInputActive) {
      return null
    }
    return (
      <span ref={textRef} onClick={handleSpanClick} className="inline-text_copy">
        {text || placeholder}
      </span>
    )
  }

  const renderInput = () => {
    if (!isInputActive) {
      return null
    }
    return (
      <textarea
        ref={inputRef}
        // set the width to the input length multiplied by the x height
        // it's not quite right but gets it close
        style={{
          width: `${textWidth.current}px`,
          height: `${textHeight.current}px`,
        }}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        className="inline-text_input"
      />
    )
  }

  return (
    <StyledInlineEdit className="inline-text" ref={wrapperRef}>
      {renderText()}
      {renderInput()}
    </StyledInlineEdit>
  )
}

InlineEdit.propTypes = {
  text: PropTypes.string,
  onSetText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
}

export default InlineEdit
