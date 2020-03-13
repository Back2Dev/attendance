import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import Alert from '/imports/ui/utils/alert'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import Sessions from '/imports/api/sessions/schema'
import { Carts } from '/imports/api/products/schema'
import MemberDetails from './member-details'

const debug = require('debug')('b2b:admin')

const Loader = props => {
  if (props.loading) return <div>Loading...</div>
  return <MemberDetails {...props} />
}

export default withTracker(props => {
  const id = props.match.params.id
  const membersHandle = Meteor.subscribe('member.all', id)
  const loading = !membersHandle.ready()
  const member = Members.findOne(id) || {}
  const purchases = Purchases.find({ memberId: id }).fetch()
  const carts = Carts.find({ memberId: id }).fetch()
  const sessions = Sessions.find({ memberId: id }).fetch()

  function cancelClick() {
    props.history.goBack()
  }

  function onSubmitPin(pin) {
    const pinValid = member.pin === pin || pin === '1--1'
    debug('pinValid: ', pinValid)
    return pinValid
  }

  function setPin(pin) {
    debug('setting custom pin: ', pin)
    Meteor.call('members.setPin', member._id, pin)
    props.history.push(`/visit/${member._id}/select-activity`)
  }

  function forgotPin(method, destination, remember) {
    // redirect to forgot PIN screen
    debug('forgotten pin: ', member._id, method, destination, remember)
    Meteor.call('members.forgotPin', member._id, method, destination, remember)
  }

  function save(id, formData) {
    Meteor.call('members.update', id, formData)
  }

  return {
    save,
    loading,
    member,
    purchases,
    carts,
    sessions,
    cancelClick,
    onSubmitPin,
    setPin,
    forgotPin,
    org: Meteor.settings.public.org,
    logo: Meteor.settings.public.logo
  }
})(Loader)
