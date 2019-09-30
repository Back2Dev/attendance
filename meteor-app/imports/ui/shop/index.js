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
    getPromo,
    settings: Meteor.settings.public
  }
})(ShopFront)
