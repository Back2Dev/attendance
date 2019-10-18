import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Alert from 'react-s-alert'
import { escapeRegExp } from 'lodash'
import moment from 'moment'

import Matching from './matching'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import { Carts } from '/imports/api/products/schema'
import { eventLog } from '/imports/api/eventlogs'
const debug = require('debug')('b2b:admin')

const MatchingLoader = props => {
  if (props.loading) return <div>Loading...</div>
  return <Matching {...props} />
}

export default withTracker(props => {
  const membersHandle = Meteor.subscribe('all.members.carts')
  const loading = !membersHandle.ready()

  const filter = query => {
    const searching = query != ''
    if (searching) {
      return {
        name: { $regex: new RegExp(escapeRegExp(query)), $options: 'i' }
      }
    } else {
      return {}
    }
  }

  const members = Members.find(filter(Session.get('searchQuery')), {
    sort: {
      sessionCount: -1
    }
  }).fetch()

  const carts = Carts.find({}).fetch()
  const purchases = Purchases.find({}).fetch()

  const memberWord = Meteor.settings.public.member || 'Volunteer'
  const memberWords = memberWord + 's'

  const removeCart = id => {
    const cart = Carts.findOne(id)
    Meteor.call('cart.remove', id, (err, res) => {
      if (err) {
        Alert.error('error whilst removing cart')
      } else {
        Alert.success(`successfully removed ${res} cart`)
        eventLog({
          who: 'Admin',
          what: `removed cart id: ${id}`,
          object: cart
        })
      }
    })
  }

  const extendMember = async (memberId, purchaseId) => {
    const member = Members.findOne(memberId)
    const when = prompt(`Extend membership for ${member.name} to (DD/MM/YYYY)`)
    if (when) {
      const isoWhen = moment(when, 'DD/MM/YYYY').format('YYYY-MM-DD')
      Meteor.call('purchase.extend', memberId, purchaseId, isoWhen, (err, res) => {
        if (err) {
          Alert.error('error whilst extending member')
        } else {
          Alert.success(`successfully extended ${res} membership to ${isoWhen}`)
          eventLog({
            who: 'Admin',
            what: `extended member id: ${memberId} to ${isoWhen}`,
            object: member
          })
        }
      })
    }
  }

  return {
    loading,
    members,
    carts,
    purchases,
    extendMember,
    removeCart,
    memberWords
  }
})(MatchingLoader)
