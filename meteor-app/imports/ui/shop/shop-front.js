import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'

import AddContainer from './add-container'
import Building from './building'
import Department from './department'
import Checkout from './checkout'
import Address from './address'
import CreditCard from './credit-card'
import RegisterCard from './register-card'
import Failed from './failed'
import Receipt from './receipt'
import Renewal from './renewal'
import CCRegistered from './cc-registered'
import CCCharge from './cc-charge'
import EmailSent from './email-sent'
import { CartContextProvider } from './cart-data'
const debug = require('debug')('b2b:shop')

const ShopFront = props => {
  if (props.loading) return <div>Loading ...</div>
  return (
    <CartContextProvider
      cart={props.carts[0]}
      cartUpdate={props.cartUpdate}
      getPromo={props.getPromo}
      settings={props.settings}
    >
      <Switch>
        <Route path="/shop" exact component={Building} />
        <Route path="/shop/add/:code/:memberId" exact component={AddContainer} />
        <Route path="/shop/checkout" exact component={Checkout} />
        <Route path="/shop/address" exact component={Address} />
        <Route path="/shop/credit-card" exact component={CreditCard} />
        <Route path="/shop/register-card/:id" exact component={RegisterCard} />
        <Route path="/shop/receipt" exact component={Receipt} />
        <Route path="/shop/failed" exact component={Failed} />
        <Route path="/shop/type/:type" component={Department} />
        <Route path="/renew/:id/:cartId" component={Renewal} />
        <Route path="/shop/registered" exact component={CCRegistered} />
        <Route path="/shop/charge/:cartId" exact component={CCCharge} />
        <Route path="/shop/sent/:email" exact component={EmailSent} />
      </Switch>
    </CartContextProvider>
  )
}

ShopFront.propTypes = {
  cartUpdate: PropTypes.func.isRequired,
  getPromo: PropTypes.func.isRequired
}

export default ShopFront
