import React from 'react'
import PropTypes from 'prop-types'

/**
 * This component wraps children depending on the `condition` boolean prop.
 */
const ConditionalWrap = ({ condition, wrapTrue, wrapFalse, ...props }) => {
  // these checks just make it easier to consume the component. Eg. you can supply just wrapTrue
  // prop and not have to supply wrapFalse because it will just render children as is.
  if (condition && typeof wrapTrue === 'function') {
    return wrapTrue(props)
  } else if (!condition && typeof wrapFalse === 'function') {
    return wrapFalse(props)
  }

  return <div {...props} />
}

ConditionalWrap.propTypes = {
  /** value to determine which wrapper to render */
  condition: PropTypes.bool.isRequired,
  /** render this wrap element if `condition` is `true`. eg. `(props) =>
   * <span>{props.children}</span>` If prop is not specified, it will render children in a `div` */
  wrapTrue: PropTypes.func,
  /** same as wrapTrue but if `condition` is `false` */
  wrapFalse: PropTypes.func,
  /** the wrapper element's children */
  children: PropTypes.node.isRequired,
}

ConditionalWrap.defaultProps = {
  condition: false,
}

export default ConditionalWrap
