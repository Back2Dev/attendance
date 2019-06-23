import React from 'react'
import PropTypes from 'prop-types'

const CartList = ({ carts, removeCart }) => {
  return (
    <ul style={{ listStyleType: 'circle' }}>
      {carts.map(cart => (
        <span key={cart._id}>
          <li key={cart._id}>
            {moment(cart.createdAt).format('D MMM YYYY')} {cart.status}
            &nbsp;
            <span style={{ color: 'red' }} onClick={() => removeCart(cart._id)}>
              X
            </span>
          </li>
          {cart.products.map(product => (
            <li key={product._id}>
              {product.qty} x {product.code} = <Price cents={product.price} />
            </li>
          ))}
        </span>
      ))}
    </ul>
  )
}

CartList.propTypes = {
  removeCart: PropTypes.func.isRequired,
  carts: PropTypes.array.isRequired
}

export default CartList
