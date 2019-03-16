import React, { useState, createRef } from 'react'
import PropTypes from 'prop-types'
import { Button, Card } from 'semantic-ui-react'
import Cart from './shopping-cart'

const Price = props => <span>Price: ${props.cents / 100}</span>
const Item = props => {
  const go = () => {
    props.history.push(`/shop/1/1`)
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
          Buy now
        </Button>
      </Card.Content>
    </Card>
  )
}

const Counter = props => {
  const { products, loading, productTypes } = props
  const [prodType] = productTypes
  const ref = createRef()
  if (loading) return <div>Loading...</div>
  return (
    <div>
      <Cart ref={ref} } />
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
  productTypes: PropTypes.array
}
export default Counter
