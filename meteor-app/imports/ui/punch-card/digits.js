import React from 'react'
import { Card } from 'semantic-ui-react'

const digitStyle = {
  width: '50px',
  height: '50px',
  background: 'red',
  borderRadius: '50%'
}

const DigitsArr = props => {
  var elements = []
  for (var i = 1; i <= 18; i++) {
    // push the component to elements!
    elements.push(<div style={digitStyle}>{i}</div>)
  }
  return <span>{elements}</span>
}

export default DigitsArr
