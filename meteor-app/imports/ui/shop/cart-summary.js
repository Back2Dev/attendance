import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Header, Icon, Menu } from 'semantic-ui-react'
import Alert from 'react-s-alert'

import { CartContext } from './cart-data'
import Price from './price'

const cartStyle = { right: 10, top: 10, position: 'absolute', zIndex: 5 }
const Cart = props => {
  const { state, dispatch } = React.useContext(CartContext)

  const checkout = () => {
    if (state.totalqty) props.history.push('/shop/checkout')
    else {
      Alert.error(
        'You do not have any items in your cart yet, please add something before going to the checkout'
      )
    }
  }
  return (
    <div style={cartStyle}>
      <Button
        type='button'
        onClick={checkout}
        icon
        labelPosition='left'
        color='green'
        size='small'
        compact
      >
        <Icon name='shopping cart' />
        {!state.totalqty && <span>Cart is empty</span>}
        {state.totalqty > 0 && (
          <span>
            {state.totalqty} items, (<Price cents={state.price} />)
          </span>
        )}
      </Button>
    </div>
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
      Alert.error(
        'You do not have any items in your cart yet, please add something before going to the checkout'
      )
    }
  }
  return (
    <Menu.Item position='right' onClick={checkout} color='green'>
      <Icon name='shopping cart' />
      {!state.totalqty && <span>Cart is empty</span>}
      {state.totalqty > 0 && (
        <span>
          {state.totalqty} items, (<Price cents={state.price} />)
        </span>
      )}
    </Menu.Item>
  )
}
