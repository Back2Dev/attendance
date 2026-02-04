import React from 'react'
import PropTypes from 'prop-types'
import { Button, Chip, Stack } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Alert from '/imports/ui/utils/alert'

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
    <Stack direction="row" spacing={1} alignItems="center">
      <CustomerLabel name={sessionStorage.getItem('name')} />
      <Chip
        variant="outlined"
        icon={<ShoppingCartIcon />}
        label={
          !state.totalqty ? (
            <>Cart is empty {!state._id && '!'}</>
          ) : (
            <>
              {state.totalqty} {items} (<Price cents={state.price} />){' '}
              {!state._id && '!'}
            </>
          )
        }
      />
      {state.totalqty > 0 && (
        <Button
          type="button"
          variant="contained"
          color="success"
          onClick={checkout}
          id="checkout"
        >
          Go to checkout now
        </Button>
      )}
    </Stack>
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
      <Button
        type="button"
        variant="outlined"
        color="primary"
        startIcon={<ShoppingCartIcon />}
        onClick={checkout}
      >
        Cart is empty {!state._id && '!'}
      </Button>
    )
  }

  const items = state.totalqty > 1 ? 'items' : 'item'
  return (
    <Button
      type="button"
      variant="contained"
      color="success"
      startIcon={<ShoppingCartIcon />}
      onClick={checkout}
    >
      {state.totalqty} {items} (<Price cents={state.price} />) {!state._id && '!'}
    </Button>
  )
}
