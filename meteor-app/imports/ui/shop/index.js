import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { cloneDeep } from 'lodash'
import { Carts } from '/imports/api/products/schema'
import ShopFront from './shop-front'
import Members from '../../api/members/schema'

const debug = require('debug')('b2b:shop')

const getPromo = async code => {
  return await Meteor.callAsync('getPromo', code)
}

const cartUpdate = data => {
  try {
    const contents = cloneDeep(data)
    const id = contents._id
    if (id) {
      delete contents._id
      debug(`Saving cart id ${id}`)
      Carts.update(id, { $set: { ...contents } })
    } else {
      const id = Carts.insert(contents)
      debug(`New cart id is ${id}`)
      sessionStorage.setItem('mycart', id)
    }
  } catch (e) {
    console.error(`Error: [${e.message}] encountered while saving shopping cart`)
  }
}

const chargeCard = async ({ price, email, customer_token, metadata }) => {
  try {
    /* Submit the payment  */
    debug('Charging credit card')
    const packet = {
      amount: price.toString(),
      currency: 'AUD',
      description: 'Purchase',
      email,
      metadata
    }

    if (price === 0) {
      state.status = CONSTANTS.CART_STATUS.COMPLETE
      dispatch({ type: 'save-cart', payload: null })
      props.history.replace('/shop/registered')
    } else {
      debug('Making payment')
      // setStatus('Transmitting')
      const result = await Meteor.callAsync('makePayment', packet)
      // setStatus('')
      if (typeof result === 'string' && (result.match(/^Request failed/i) || result.match(/error/i))) {
        setErrors({ remote: result })
        // props.history.push(`/shop/failed/${result}`)
      } else {
        // The cart gets updated with the response on the server
        // So show the payment receipt now
        Alert.success('Payment completed')
        state.status = CONSTANTS.CART_STATUS.COMPLETE
        props.history.replace('/shop/receipt')
      }
    }
  } catch (err) {
    debug(`Error $err.message`, err)
  }
}

export default withTracker(props => {
  document.title = `${Meteor.settings.public.org} - shop`
  cartId = sessionStorage.getItem('mycart')
  memberId = sessionStorage.getItem('memberId')
  debug(`Cart id is ${cartId}`)
  const cartSub = Meteor.subscribe('cart', cartId, memberId)
  return {
    cart: Carts.findOne(cartId),
    member: Members.findOne(memberId),
    loading: !cartSub.ready(),
    cartUpdate,
    chargeCard,
    getPromo,
    settings: Meteor.settings.public
  }
})(ShopFront)
