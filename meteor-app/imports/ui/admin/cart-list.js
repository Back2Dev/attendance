import React from 'react'

const CartList = ({ carts }) => {
  return (
    <ul style={{ listStyleType: 'circle' }}>
      {carts.map(cart => (
        <li key={cart._id}>
          {moment(cart.createdAt).format('D MMM YYYY')} {cart.status} <Price cents={cart.price} />
          <ol type="a">
            {cart.products.map(product => (
              <li key={product._id}>
                {product.qty} x {product.code} {product.name} = <Price cents={product.price} />
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ul>
  )
}

export default CartList
