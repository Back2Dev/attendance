import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import Products, { Carts } from '/imports/api/products/schema'
import Renew from './renew'

const debug = require('debug')('b2b:renew')

const Loader = props => {
  if (props.loading) return <div>Loading...</div>
  return <Renew {...props} />
}

export default withTracker(props => {
  const id = props.match.params.id
  const cartId = props.match.params.cartId
  if (cartId) sessionStorage.setItem('mycart', cartId)
  const membersHandle = Meteor.subscribe('member.renew', id, cartId)
  const loading = !membersHandle.ready()
  const member = Members.findOne(id) || {}
  const purchases = Purchases.find({ memberId: id }, { sort: { createdAt: -1 } }).fetch()
  const cart = Carts.findOne(cartId)
  const products = Products.find({ active: true }).fetch()
  let myProduct
  if (purchases.length) {
    myProduct = Products.findOne(purchases[0].productId)
  }

  return {
    org: Meteor.settings.public.org,
    logo: Meteor.settings.public.logo,
    loading,
    member,
    purchases,
    products,
    cart,
    myProduct
  }
})(Loader)
