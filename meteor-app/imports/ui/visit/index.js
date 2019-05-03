import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
const debug = require('debug')('b2b:visit')
import { ReactiveVar } from 'meteor/reactive-var'
import Members from '/imports/api/members/schema'
import Main from './main'

const validPin = new ReactiveVar(false)
const setPinSuccess = new ReactiveVar(false)

export default withTracker(props => {
  const id = props.match.params.id
  const membersHandle = Meteor.subscribe('member', id)
  const loading = !membersHandle.ready()
  const member = Members.findOne(id)

  const memberHasOwnPin = (() => !!(member && member.pin))()
  if (member && member.pin && member.pin === '----') validPin.set(true)
  const memberHasPhoneEmail = !!(member && member.email && member.mobile)

  function recordVisit({ duration }) {
    if (!member.isHere) {
      debug('member arriving', id, duration)
      Meteor.call('arrive', id, duration)
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
    debug('clearingPin:')
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
})(Main)
