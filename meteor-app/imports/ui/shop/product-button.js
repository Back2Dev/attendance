import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

const ProductButton = props => {
  const img = props.image || '/images/gym.jpg'
  const { add, color, name } = props
  return (
    <Button type="button" onClick={props.onClick} color={color} style={{ margin: '4px' }}>
      {name}
    </Button>
  )
}

export default ProductButton
