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
import NotFoundComponent from '/imports/ui/components/commons/not-found.js'

const debug = require('debug')('app:shop')

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
        <Route path="" exact Component={Building} />
        <Route path="add/:code/:profileId" exact Component={AddContainer} />
        <Route path="checkout" exact Component={Checkout} />
        <Route path="address" exact Component={Address} />
        <Route path="credit-card" exact Component={CreditCard} />
        <Route path="register-card/:id" exact Component={RegisterCard} />
        <Route path="receipt" exact Component={Receipt} />
        <Route path="type/:type" Component={Department} />
        <Route path="renew/:id/:cartId" Component={Renewal} />
        <Route path="registered" exact Component={CCRegistered} />
        <Route path="charge/:profileId/:cartId" exact Component={CCCharge} />
        <Route path="sent/:email" exact Component={EmailSent} />
        <Route path="paid/:profileId" exact Component={Paid} />
        <Route path="already-paid" exact Component={AlreadyPaid} />{' '}
        <Route component={NotFoundComponent} />
      </Routes>
    </CartContextProvider>
  )
}

ShopFront.propTypes = {
  cartUpdate: PropTypes.func.isRequired,
  getPromo: PropTypes.func.isRequired,
}

export default ShopFront

// {/* <Route path="/kiosk/address" exact Component={Address} />
// <Route path="/kiosk/credit-card" exact Component={CreditCard} />
// <Route path="/kiosk/register-card/:id" exact Component={RegisterCard} />
// <Route path="/kiosk/registered" exact Component={CCRegistered} /> */}
