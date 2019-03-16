import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Header } from 'semantic-ui-react'

import { CartContext } from './cart-data'

const cartStyle = { right: 10, top: 10, position: 'absolute', zIndex: 5 }
// const cartStyle = {}
const Cart = props => {
  // const { count = 1, price = 0 } = props
  const { state, dispatch } = React.useContext(CartContext)
  return (
    <div style={cartStyle}>
      <Header as="h3">
        {state.products.length} items ${state.price}
      </Header>
    </div>
  )
}

Cart.propTypes = {}
export default Cart
