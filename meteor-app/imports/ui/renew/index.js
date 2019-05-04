import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import Products from '/imports/api/products/schema'
import Main from './main'

const debug = require('debug')('b2b:renew')

export default withTracker(props => {
  const id = props.match.params.id
  const membersHandle = Meteor.subscribe('member.renew', id)
  const loading = !membersHandle.ready()
  const member = Members.findOne(id)
  const purchases = Purchases.find({ memberId: id }).fetch()
  const products = purchases.length ? Products.find(purchases[0].productId).fetch() : []

  return {
    loading,
    member,
    purchases,
    products
  }
})(Main)
