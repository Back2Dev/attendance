import React from 'react'
import PropTypes from 'prop-types'
import { Card, Segment } from 'semantic-ui-react'

const CartList = ({ carts, removeCart }) => {
  const items = carts.map(cart => {
    return {
      description: cart.products.map(product => (
        <span>
          {product.qty} x {product.code} <Price cents={product.price} />
        </span>
      )),
      meta: `Created: ${moment(cart.createdAt).format('D MMM YYYY')} status: ${cart.status}`,
      header: (
        <span>
          {cart.totalqty} items, <Price cents={cart.price} />
        </span>
      )
    }
  })
  return <Card.Group items={items} />
}

CartList.propTypes = {
  removeCart: PropTypes.func.isRequired,
  carts: PropTypes.array.isRequired
}

export default CartList
