import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PropTypes from 'prop-types'
import { cloneDeep } from 'lodash'

import AddContainer from './add-container'
import Building from './building'
import Department from './department'
import Checkout from './checkout'
import Address from './address'
import CreditCard from './credit-card'
import RegisterCard from './register-card'
import Receipt from './receipt'
import Renewal from './renewal'
import CCRegistered from './cc-registered'
import CCCharge from './cc-charge'
import EmailSent from './email-sent'
import Paid from './paid'
import AlreadyPaid from './already-paid'
import { CartContextProvider } from './cart-data'
import context from '/imports/ui/utils/nav'
import useHistory from '/imports/ui/utils/history'
import { HelpOutline } from '@mui/icons-material'

const debug = require('debug')('b2b:shop')

const ShopFront = (props) => {
  const { location } = useHistory()
  debug({ location })
  if (location.pathname === '/shop') {
    context.set('mode', 'shop')
  }

  if (props.loading) return <div>Loading ...</div>
  const cart = props.cart ? cloneDeep(props.cart) : null
  if (cart) {
    cart.member = {}
    if (props.member)
      'email,name,avatar,paymentCustId,autoPay'
        .split(/,/)
        .forEach((key) => (cart.member[key] = props.member[key]))
  }
  return (
    <CartContextProvider
      cart={cart}
      cartUpdate={props.cartUpdate}
      getPromo={props.getPromo}
      settings={props.settings}
      chargeCard={props.chargeCard}
    >
      <Routes>
        <Route path="/shop" exact component={Building} />
      </Routes>
    </CartContextProvider>
  )
}

ShopFront.propTypes = {
  cartUpdate: PropTypes.func.isRequired,
  getPromo: PropTypes.func.isRequired,
}

export default ShopFront

// <Route path="/shop/add/:code/:memberId" exact component={AddContainer} />
// <Route path="/shop/checkout" exact component={Checkout} />
// <Route path="/shop/address" exact component={Address} />
// <Route path="/shop/credit-card" exact component={CreditCard} />
// <Route path="/shop/register-card/:id" exact component={RegisterCard} />
// <Route path="/shop/receipt" exact component={Receipt} />
// <Route path="/shop/type/:type" component={Department} />
// <Route path="/shop/renew/:id/:cartId" component={Renewal} />
// <Route path="/shop/registered" exact component={CCRegistered} />
// <Route path="/shop/charge/:memberId/:cartId" exact component={CCCharge} />
// <Route path="/shop/sent/:email" exact component={EmailSent} />
// <Route path="/shop/paid/:memberId" exact component={Paid} />
// <Route path="/shop/already-paid" exact component={AlreadyPaid} />
// {/* <Route path="/kiosk/address" exact component={Address} />
// <Route path="/kiosk/credit-card" exact component={CreditCard} />
// <Route path="/kiosk/register-card/:id" exact component={RegisterCard} />
// <Route path="/kiosk/registered" exact component={CCRegistered} /> */}
