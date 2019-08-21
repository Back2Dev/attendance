import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Container } from 'semantic-ui-react'
import CartButton, { CartMenuItem } from './cart-summary'
import CustomerMenuItem from './customer'
import ProductCard from './product-card'
import { CartContext } from './cart-data'

const Counter = props => {
  const { products, loading, prodType, productTypes } = props
  const { state, dispatch } = React.useContext(CartContext)

  const select = code => {
    props.history.push(`/shop/type/${code}`)
  }

  if (loading) return <div>Loading...</div>
  if (!prodType) return <div>Product type not found</div>
  return (
    <div>
      <Menu>
        <Menu.Item>
          <h2>
            <span style={{ color: prodType.color }}>
              <Icon name={prodType.icon} />
              {prodType.name} ({products.length})
            </span>
          </h2>
        </Menu.Item>
        {productTypes.map(ptype => (
          <Menu.Item key={ptype.type} onClick={() => select(ptype.type)}>
            <span style={{ color: ptype.color }}>
              <Icon name={ptype.icon} />
              {ptype.name}
            </span>
          </Menu.Item>
        ))}
        <CustomerMenuItem />
        <CartMenuItem history={props.history} />
      </Menu>

      {prodType.description}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map(item => (
          <ProductCard {...item} key={item._id} mode="add" color={prodType.color} />
        ))}
      </div>
      {state.totalqty > 0 && (
        <Container>
          <CartButton history={props.history} />
        </Container>
      )}
    </div>
  )
}

Counter.propTypes = {
  loading: PropTypes.bool.isRequired,
  products: PropTypes.array,
  productTypes: PropTypes.array
}
export default Counter
