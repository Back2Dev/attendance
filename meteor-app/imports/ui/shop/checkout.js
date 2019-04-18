import React from 'react'
import { Card, Segment, Button } from 'semantic-ui-react'

import { CartContext } from './cart-data'
import ProductCard from './product-card'
import BuyMe from './buy-me'

const Checkout = props => {
  const { state, dispatch } = React.useContext(CartContext)
  if (!state.products.length) {
    return (
      <div>
        <h4>Checkout </h4>
        <Segment raised color="red">
          <p>You have nothing in your shopping cart</p>
          <Button type="button" primary onClick={() => props.history.push('/shop')}>
            Continue shopping
          </Button>
        </Segment>
      </div>
    )
  } 
    return (
      <div>
        <h4>Checkout </h4>
        <Card.Group>
          {state.products.map(p => {
            return <ProductCard {...p} key={p._id} mode="remove" />
          })}
        </Card.Group>
        <hr />
        <BuyMe />
      </div>
    )
  
}

export default Checkout
