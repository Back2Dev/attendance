import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Alert from 'react-s-alert'
import { escapeRegExp } from 'lodash'
import moment from 'moment'

import Admin from './admin'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import { Carts } from '/imports/api/products/schema'
import { eventLog } from '/imports/api/eventlogs'
import { saveToArchive } from '/imports/api/archive'
const debug = require('debug')('b2b:admin')

const Loader = props => {
  if (props.loading) return <div>Loading...</div>
  return <Admin {...props} />
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

  const uploadXL = e => {
    e.preventDefault()

    const file = e.target[0].files[0]
    const msg = file ? `Adding your parts` : `Oops! Forgot to add the file? Try again uploading the file`
    Alert.info(msg)
    const reader = new FileReader()
    reader.onloadend = function() {
      const data = reader.result
      Meteor.callAsync('parts.load', data)
    }
    reader.readAsBinaryString(file)
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
  const orgid = Meteor.settings.public.orgid || 'b2b'

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

  const addProduct = (memberId, name) => {
    sessionStorage.setItem('memberId', memberId)
    sessionStorage.setItem('name', name)
    props.history.push('/shop')
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
  const removeMember = async id => {
    const member = Members.findOne(id)
    Meteor.call('members.remove', id, (err, res) => {
      if (err) {
        Alert.error('error whilst removing member')
      } else {
        Alert.success(`successfully removed ${res} member `)
        eventLog({
          who: 'Admin',
          what: `removed member id: ${id}`,
          object: member
        })
        saveToArchive('member', member)
      }
    })
  }

  const getAllSessions = async () => {
    return await Meteor.callAsync('getAllSessions')
  }

  return {
    loading,
    members,
    carts,
    purchases,
    removeMember,
    extendMember,
    addProduct,
    removeCart,
    uploadXL,
    memberWords,
    orgid,
    getAllSessions
  }
})(Loader)
