import React from 'react'
import PropTypes from 'prop-types'
import { Inner } from './inner'
import { Frame } from '$sb/components/frame'

const Question = ({ ...props }) => {
  return (
    <Frame {...props}>
      <Inner {...props} />
    </Frame>
  )
}

Question.displayName = 'Question'

Question.propTypes = {
  pid: PropTypes.string.isRequired,
  index: PropTypes.number,
}

export { Question }
