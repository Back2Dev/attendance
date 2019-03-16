import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Sticky } from 'semantic-ui-react'
import { cloneDeep } from 'lodash'
import Cart from './shopping-cart'
import { CartContext } from './cart-data'

const Price = props => <span>Price: ${props.cents / 100}</span>
const Item = props => {
  const { state, dispatch } = React.useContext(CartContext)
  const go = () => {
    const product = cloneDeep(props)
    product.qty = 0
    dispatch({ type: 'add', payload: product })
  }
  return (
    <Card>
      <Card.Content>
        <Card.Header>{props.name}</Card.Header>
        <Card.Description>{props.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Price cents={props.price} />{' '}
        <Button primary type="button" onClick={go}>
          Add to cart
        </Button>
      </Card.Content>
    </Card>
  )
}

const Counter = props => {
  const { products, loading, productTypes } = props
  const [prodType] = productTypes
  const { state, dispatch } = React.useContext(CartContext)

  if (loading) return <div>Loading...</div>
  return (
    <div>
      <Cart />
      <h2>
        {prodType.name} ({products.length})
      </h2>
      {prodType.description}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map(item => (
          <Item {...item} key={item._id} />
        ))}
      </div>
    </div>
  )
}

Counter.propTypes = {
  loading: PropTypes.bool.isRequired,
  products: PropTypes.array,
  productTypes: PropTypes.array,
}
export default Counter
