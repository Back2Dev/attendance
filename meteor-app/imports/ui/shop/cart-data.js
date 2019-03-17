import * as React from 'react'
import PropTypes from 'prop-types'

const CartContext = React.createContext()

const initialState = {
  price: 0,
  totalqty: 0,
  products: [],
}

const recalc = state => {
  state.price = state.products.reduce((acc, product) => acc + product.qty * product.price, 0)
  state.totalqty = state.products.reduce((acc, product) => acc + product.qty, 0)
  // This looks like a good moment to save the cart to the db
  if (cartUpdater) {
    cartUpdater(state)
  }
}

const reducer = (state, action) => {
  switch (action.type) {
  case 'reset':
    return initialState
  case 'add':
    if (
        state.products.find((prod, ix) => {
          if (prod._id === action.payload._id) {
            state.products[ix].qty += 1
            return prod
          }
        })
      ) {
        recalc(state)
        return { ...state }
      }
    action.payload.qty = 1
    state.products.push(action.payload)
    recalc(state)
    return { ...state }
  case 'remove':
    const i = state.products.findIndex((prod, ix) => {
        if (prod._id === action.payload) {
          return prod
        }
      })
    if (i >= 0) {
        state.products.splice(i, 1)
        recalc(state)
      }
    return { ...state }
  default:
    return { ...state }
  }
}

function CartContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, props.cart || initialState)
  const value = { state, dispatch }
  cartUpdater = props.cartUpdate

  return <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
}

CartContextProvider.propTypes = {
  cartUpdate: PropTypes.func.isRequired,
  cart: PropTypes.object,
}

const CartContextConsumer = CartContext.Consumer

export { CartContext, CartContextProvider, CartContextConsumer }
