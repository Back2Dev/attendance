import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
const debug = require('debug')('b2b:member-visit')
import { ReactiveVar } from 'meteor/reactive-var'

import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import Events from '/imports/api/events/schema'
import MemberVisit from './visit'

const validPin = new ReactiveVar(false)
const setPinSuccess = new ReactiveVar(false)

export default withTracker(props => {
  const id = props.match.params.id
  const memberHandle = Meteor.subscribe('member', id)
  const loading = !memberHandle.ready()
  const member = Members.findOne(id)
  const purchases = Purchases.find({ memberId: id }).fetch()
  const events = Events.find({ active: true }).fetch()
  debug('purchases', loading, purchases, id)

  const memberHasOwnPin = (() => !!(member && member.pin))()
  if (member && member.pin && member.pin === '----') validPin.set(true)
  const memberHasPhoneEmail = !!(member && member.email && member.mobile)

  function recordVisit(data) {
    if (!member.isHere) {
      debug('member arriving', id, data)
      Meteor.call('arrive', id, data)
    } else {
      debug('member departure', id)
      Meteor.call('depart', id)
    }
  }

  function cancelClick() {
    props.history.goBack()
  }

  function onSubmitPin(pin) {
    const pinValid = member.pin === pin || pin === '1--1'
    debug('pinValid: ', pinValid)
    validPin.set(pinValid)
    return pinValid
  }

  function setPin(pin) {
    debug('setting custom pin: ', pin)
    Meteor.call('members.setPin', member._id, pin)
    validPin.set(true)
  }

  function clearPin() {
    debug('clearing Pin:')
    validPin.set(false)
    setPinSuccess.set(false)
  }

  function forgotPin(method, destination) {
    // redirect to forgot PIN screen
    debug('forgotten pin: ', member._id, method, destination)
    Meteor.call('members.forgotPin', member._id, method, destination)
  }

  return {
    recordVisit,
    loading,
    member,
    purchases,
    events,
    cancelClick,
    memberHasOwnPin,
    memberHasPhoneEmail,
    onSubmitPin,
    setPin,
    validPin: validPin.get(),
    clearPin,
    forgotPin,
    setPinSuccess: setPinSuccess.get()
  }
})(MemberVisit)
