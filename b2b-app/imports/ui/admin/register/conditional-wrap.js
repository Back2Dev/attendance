import React from 'react'
import PropTypes from 'prop-types'

const ConditionalWrap = ({ condition, wrapTrue, wrapFalse, children }) => {
  if (condition && typeof wrapTrue === 'function') {
    return wrapTrue(children)
  } else if (!condition && typeof wrapFalse === 'function') {
    return wrapFalse(children)
  }
  return <>{children}</>
}

ConditionalWrap.propTypes = {
  condition: PropTypes.bool.isRequired,
  wrapTrue: PropTypes.func,
  wrapFalse: PropTypes.func,
  children: PropTypes.node.isRequired,
}

ConditionalWrap.defaultProps = {
  condition: false,
}

export default ConditionalWrap
