import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Building from './building'
import Department from './department'
import Checkout from './checkout'
import { CartContextProvider } from './cart-data'
const debug = require('debug')('b2b:shop')

const ShopFront = props => {
  if (props.loading) return <div>Loading...</div>
  return (
    <CartContextProvider cart={props.carts[0]} cartUpdate={props.cartUpdate}>
      <Switch>
        <Route path='/shop' exact component={Building} />
        <Route path='/shop/checkout' exact component={Checkout} />
        <Route path='/shop/:type' component={Department} />
      </Switch>
    </CartContextProvider>
  )
}

export default ShopFront
