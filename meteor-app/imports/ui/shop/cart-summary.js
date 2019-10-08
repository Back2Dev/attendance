import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Label, Icon, Menu } from 'semantic-ui-react'
import Alert from 'react-s-alert'

import { CartContext } from './cart-data'
import Price from './price'
import { CustomerLabel } from './customer'

const cartStyle = { right: 10, top: 10, position: 'absolute', zIndex: 5 }
const Cart = props => {
  const { state, dispatch } = React.useContext(CartContext)

  const checkout = () => {
    if (state.totalqty) props.history.push('/shop/checkout')
    else {
      Alert.error('You do not have any items in your cart yet, please add something before going to the checkout')
    }
  }
  const items = state.totalqty > 1 ? 'items' : 'item'
  return (
    <Button as="div" labelPosition="left" size="large">
      <CustomerLabel name={sessionStorage.getItem('name')} />
      <Label basic pointing="right">
        <Icon name="shopping cart" />
        {!state.totalqty && <span>Cart is empty {!state._id && '!'}</span>}
        {state.totalqty > 0 && (
          <div>
            {state.totalqty} {items} (<Price cents={state.price} />) {!state._id && '!'}
          </div>
        )}
      </Label>
      {state.totalqty > 0 && (
        <Button type="button" color="green" onClick={checkout} id="checkout">
          Go to checkout now
        </Button>
      )}
    </Button>
  )
}

Cart.propTypes = {
  history: PropTypes.object
}
export default Cart

export const CartMenuItem = props => {
  const { state, dispatch } = React.useContext(CartContext)

  const checkout = () => {
    if (state.totalqty) props.history.push('/shop/checkout')
    else {
      Alert.error('You do not have any items in your cart yet, please add something before going to the checkout')
    }
  }
  if (!state.totalqty) {
    return (
      <Menu.Item position="right" onClick={checkout} color="blue">
        <Icon name="shopping cart" /> Cart is empty {!state._id && '!'}
      </Menu.Item>
    )
  }

  const items = state.totalqty > 1 ? 'items' : 'item'
  return (
    <Menu.Item position="right" onClick={checkout} color="green">
      <Button type="button" color="green">
        <Icon name="shopping cart" />
        {state.totalqty} {items} (<Price cents={state.price} />) {!state._id && '!'}
      </Button>
    </Menu.Item>
  )
}
