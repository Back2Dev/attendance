import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'semantic-ui-react'
import { CartMenuItem } from './cart-summary'
import ProductCard from './product-card'

const Counter = props => {
  const { products, loading, productTypes } = props
  const [prodType] = productTypes

  if (loading) return <div>Loading...</div>
  if (!prodType) return <div>Product type not found</div>
  return (
    <div>
      <Menu>
        <Menu.Item>
          <h2>
            {prodType.name} ({products.length})
          </h2>
        </Menu.Item>
        <CartMenuItem history={props.history} />
      </Menu>

      {prodType.description}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map(item => (
          <ProductCard
            {...item}
            key={item._id}
            mode='add'
            color={prodType.color}
          />
        ))}
      </div>
    </div>
  )
}

Counter.propTypes = {
  loading: PropTypes.bool.isRequired,
  products: PropTypes.array,
  productTypes: PropTypes.array
}
export default Counter
