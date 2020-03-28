import { Meteor } from 'meteor/meteor'
import Members from '../schema'
import { Dupes } from '../schema'
import Purchases from '../../purchases/schema'
import Sessions from '../../sessions/schema'
import Products, { Carts } from '../../products/schema'
import Events from '../../events/schema'

const debug = require('debug')('b2b:server')

Meteor.publish('all.members', () => {
  return Members.find({}, { sort: { joined: -1, lastIn: -1, name: 1 } })
})

Meteor.publish('all.members.carts', () => {
  return [Members.find({}, { sort: { joined: -1, lastIn: -1, name: 1 } }), Carts.find({}), Purchases.find({})]
})
Meteor.publish('member.userid', id => {
  if (!id) return Members.find({ rubbish: true })
  else return Members.find({ userId: id })
})

Meteor.publish('members.dupes', () => {
  const names = Dupes.find({ value: { $gt: 1 } }).map(name => name._id)
  debug('Duplicates', names)
  return [
    Members.find({ name: { $in: names } }, { sort: { name: 1, joined: -1, lastIn: -1 } }),
    Dupes.find({ value: { $gt: 1 } })
  ]
})

// This one isn't used, but it probably should be :)
Meteor.publish('members.names', () => {
  return Members.find({}, { fields: { name: 1 }, sort: { joined: -1, lastIn: -1, name: 1 } })
})

Meteor.publish('member', id => {
  return [Members.find(id), Purchases.find({ memberId: id }), Events.find()]
})

Meteor.publish('member.renew', (id, cartId) => {
  return [Members.find(id), Purchases.find({ memberId: id }), Products.find({ active: true }), Carts.find(cartId)]
})

Meteor.publish('member.all', id => {
  return [
    Members.find(id),
    Purchases.find({ memberId: id }),
    Carts.find({ memberId: id }),
    Sessions.find({ memberId: id }),
    Events.find()
  ]
})
