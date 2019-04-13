import React from 'react'
import { Route, Switch } from 'react-router-dom'

import AddContainer from './add-container'
import Building from './building'
import Department from './department'
import Checkout from './checkout'
import Paid from './paid'
import { CartContextProvider } from './cart-data'
const debug = require('debug')('b2b:shop')

const ShopFront = props => {
  if (props.loading) return <div>Loading ...</div>
  return (
    <CartContextProvider cart={props.carts[0]} cartUpdate={props.cartUpdate}>
      <Switch>
        <Route path="/shop" exact component={Building} />
        <Route path="/shop/add/:code/:memberId" exact component={AddContainer} />
        <Route path="/shop/checkout" exact component={Checkout} />
        <Route path="/shop/paid" exact component={Paid} />
        <Route path="/shop/:type" component={Department} />
      </Switch>
    </CartContextProvider>
  )
}

export default ShopFront
