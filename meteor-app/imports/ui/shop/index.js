import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { Carts } from '/imports/api/products/schema'
import ShopFront from './shop-front'

const debug = require('debug')('b2b:shop')

const cartUpdate = contents => {
  try {
    const id = contents._id
    if (id) {
      delete contents._id
      debug(`Saving cart id ${id}`)
      Carts.update(id, { $set: { ...contents } })
    } else {
      const id = Carts.insert(contents)
      debug(`New cart id is ${id}`)
      localStorage.setItem('mycart', id)
    }
  } catch (e) {
    console.error(`Error: [${e.message}] encountered while saving shopping cart`)
  }
}

export default withTracker(props => {
  cartId = localStorage.getItem('mycart')
  debug(`Cart id is ${cartId}`)
  const cartSub = Meteor.subscribe('cart', cartId)
  return {
    carts: Carts.find(cartId).fetch(),
    loading: !cartSub.ready(),
    cartUpdate,
  }
})(ShopFront)
