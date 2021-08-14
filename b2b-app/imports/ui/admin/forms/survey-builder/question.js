import React from 'react'
import PropTypes from 'prop-types'

import InlineEdit from './inline-edit'

/** Question renders an editable label. It's a simple wrapper around InlineEdit */
const Question = ({ placeholder, label, onLabelChange, className, ...otherProps }) => {
  return (
    <InlineEdit
      placeholder={placeholder}
      text={label}
      onTextChange={onLabelChange}
      className={className}
      {...otherProps}
    />
  )
}

Question.propTypes = {
  /** initial label to show, defaults to empty string */
  label: PropTypes.string,
  /** shows this text when label is blank */
  placeholder: PropTypes.string.isRequired,
  /** function gets called when editable field loses focus */
  onLabelChange: PropTypes.func,
  /** custom styling */
  className: PropTypes.string,
}

Question.defaultProps = {
  placeholder: 'Type your question',
}

export default Question
