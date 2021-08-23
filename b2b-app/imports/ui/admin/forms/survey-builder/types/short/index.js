import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextFields from './short-text/textbox'
import Buttons from './icon-buttons/actionButtons'

const MyComponent = () => {
  const [index, changeIndex] = useState(0)
  return (
    <div>
      <Buttons />
    </div>
  )
}

export default MyComponent
