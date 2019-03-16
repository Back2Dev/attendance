import * as React from 'react'

const CartContext = React.createContext()

const initialState = {
  price: 0,
  totalqty: 0,
  products: []
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
        state.price = state.products.reduce((acc, product) => acc + product.qty * product.price, 0)
        state.totalqty = state.products.reduce((acc, product) => acc + product.qty, 0)
        return { ...state }
      }
      action.payload.qty = 1
      state.products.push(action.payload)

      state.price = state.products.reduce((acc, product) => acc + product.qty * product.price, 0)
      state.totalqty = state.products.reduce((acc, product) => acc + product.qty, 0)
      return { ...state }
    case 'remove':
      const i = state.products.findIndex((prod, ix) => {
        if (prod._id === action.payload) {
          return prod
        }
      })
      if (i >= 0) {
        state.products.splice(i, 1)
        state.price = state.products.reduce((acc, product) => acc + product.qty * product.price, 0)
        state.totalqty = state.products.reduce((acc, product) => acc + product.qty, 0)
      }
      return { ...state }
    default:
      return { ...state }
  }
}

function CartContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const value = { state, dispatch }

  return <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
}

const CartContextConsumer = CartContext.Consumer

export { CartContext, CartContextProvider, CartContextConsumer }
