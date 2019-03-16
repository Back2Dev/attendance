import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Shop from './building'
import Department from './department'
import Checkout from './checkout'

import { CartContextProvider } from './cart-data'

const ShopFront = props => (
  <CartContextProvider>
    <Switch>
      <Route path="/shop" exact component={Shop} />
      <Route path="/shop/checkout" exact component={Checkout} />
      <Route path="/shop/:type" component={Department} />
    </Switch>
  </CartContextProvider>
)

export default ShopFront
