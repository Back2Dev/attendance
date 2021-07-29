import React from 'react'
import PropTypes from 'prop-types'

const MyComponent = ({ onClick }) => (
  <div>
    <button onClick={onClick}>Click me</button>Hello
  </div>
)

MyComponent.propTypes = {
  onClick: PropTypes.func,
}

export default MyComponent
