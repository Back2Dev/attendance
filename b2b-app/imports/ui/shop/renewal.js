import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { useParams } from 'react-router-dom'
import React from 'react'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import Products, { Carts } from '/imports/api/products/schema'
import Renew from './renew'
import AlreadyPaid from './already-paid'
import CONSTANTS from '/imports/api/constants'

const debug = require('debug')('app:renew')

const Loader = (props) => {
  const { id, cartId } = useParams()
  const { org, logo, loading, member, purchases, products, cart, myProduct } =
    useTracker(() => {
      if (cartId) sessionStorage.setItem('mycart', cartId)
      const membersHandle = Meteor.subscribe('member.renew', id, cartId)
      const loading = !membersHandle.ready()
      const member = Members.findOne(id) || {}
      // Set up member context, then it will pick up credit card details
      if (member && member._id) {
        sessionStorage.setItem('name', member.name)
        sessionStorage.setItem('memberId', member._id)
      }
      const purchases = Purchases.find(
        { memberId: id },
        { sort: { createdAt: -1 } }
      ).fetch()
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
        myProduct,
      }
    }, [id, cartId])

  if (loading) return <div>Loading...</div>
  if (cart && cart.status === CONSTANTS.CART_STATUS.COMPLETE) {
    return (
      <AlreadyPaid
        org={org}
        logo={logo}
        loading={loading}
        member={member}
        purchases={purchases}
        products={products}
        cart={cart}
        myProduct={myProduct}
        {...props}
      />
    )
  } else {
    return (
      <Renew
        org={org}
        logo={logo}
        loading={loading}
        member={member}
        purchases={purchases}
        products={products}
        cart={cart}
        myProduct={myProduct}
        {...props}
      />
    )
  }
}

export default Loader
