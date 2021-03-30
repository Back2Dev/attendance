import * as React from 'react'
import PropTypes from 'prop-types'
import Alert from '/imports/ui/utils/alert'
import { cloneDeep } from 'lodash'

const debug = require('debug')('b2b:cart-data')

const CartContext = React.createContext()

const initialState = {
  price: 0,
  totalqty: 0,
  products: [],
  prodqty: {},
  creditCard: {},
  discount: 0
}

const recalc = state => {
  state.price = state.products.reduce((acc, product) => acc + state.prodqty[product._id] * product.price, 0)
  state.chargeAmount =
    state.products.reduce((acc, product) => acc + state.prodqty[product._id] * product.price, 0) - state.discount
  state.totalqty = state.products.reduce((acc, product) => acc + state.prodqty[product._id], 0)

  // This looks like a good moment to save the cart to the db
  if (cartUpdater) {
    cartUpdater(state)
  }
}

const saveCart = state => {
  if (cartUpdater) {
    cartUpdater(state)
  }
}

const reducer = (state, action) => {
  debug(`Dispatch: ${action.type}`, action.payload)
  let newState = cloneDeep(initialState)
  switch (action.type) {
    case 'reset':
      return cloneDeep(initialState)
    case 'clear':
      const clrS = cloneDeep(state)
      clrS.prodqty = {}
      clrS.products = []
      clrS.price = 0
      clrS.discount = 0
      clrS.chargeAmount = 0
      clrS.totalqty = 0
      // saveCart(clrS)   // There seems to be little point in saving an empty cart
      sessionStorage.removeItem('mycart')
      sessionStorage.removeItem('name')
      sessionStorage.removeItem('memberId')
      return clrS
    case 'save-cart':
      saveCart(state)
      debug('save-cart', state)
      return state
    case 'save-address':
      const newS = cloneDeep(state)
      if (newS.creditCard) delete newS.creditCard
      newS.creditCard = Object.assign({}, action.payload)
      // newS.email = action.payload.email
      saveCart(newS)
      debug('save-address', newS)
      return newS
    case 'reset-add':
      action.payload.qty = 1
      newState.products.push(action.payload)
      recalc(newState)
      Alert.info(`Added ${action.payload.name} to cart`)
      return { ...newState }
    case 'discount':
      newState = cloneDeep(state)
      newState.discount = action.payload * 100 // Convert to cents
      recalc(newState)
      // Alert.info(`Recalculated cart charge amount after discount (${action.payload})`)
      return { ...newState }
    case 'add':
      if (!state.products) state = cloneDeep(initialState)
      if (
        !state.products.find((prod, ix) => {
          if (prod._id === action.payload._id) {
            state.prodqty[action.payload._id] += 1
            return prod
          }
        })
      ) {
        state.prodqty[action.payload._id] = 1
        if (action.payload.memberId) state.memberId = action.payload.memberId
        if (action.payload.expiry) state.expiry = action.payload.expiry
        if (action.payload.email) state.email = action.payload.email
        state.products.push(action.payload)
      }

      recalc(state)
      Alert.info(`Added ${action.payload.name} to cart`)
      return { ...state }
    case 'remove':
      const i = state.products.findIndex((prod, ix) => {
        if (prod._id === action.payload) {
          return prod
        }
      })
      if (i >= 0) {
        Alert.info(`Removed ${state.products[i].name} from cart`)
        state.products.splice(i, 1)
        recalc(state)
      }
      return { ...state }
    default:
      return { ...state }
  }
}

function CartContextProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, props.cart || cloneDeep(initialState))
  state.settings = props.settings
  state.cartUpdate = props.cartUpdate
  state.getPromo = props.getPromo
  state.chargeCard = props.chargeCard
  cartUpdater = props.cartUpdate
  const value = { state, dispatch }

  return <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
}

CartContextProvider.propTypes = {
  cartUpdate: PropTypes.func.isRequired,
  cart: PropTypes.object,
  chargeCard: PropTypes.func.isRequired
}

const CartContextConsumer = CartContext.Consumer

export { CartContext, CartContextProvider, CartContextConsumer }
