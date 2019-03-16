import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Sticky, Button, Header } from 'semantic-ui-react'

const Cart = props => {
  const { ref, count = 0, price = 0 } = props
  return (
    <Sticky context={ref}>
      <Header as="h3">
        {count} items ${price}
      </Header>
    </Sticky>
  )
}

Cart.propTypes = {}
export default Cart
