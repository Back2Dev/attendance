import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
const debug = require('debug')('att:visit')
import { ReactiveVar } from 'meteor/reactive-var'
import MemberDash from '/imports/ui/member/member-dash'
import Members from '/imports/api/members/members'

const validPin = new ReactiveVar(false)
const setPinSuccess = new ReactiveVar(false)

export default withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members')
  const loading = !membersHandle.ready()
  const id = props.match.params.id
  const member = Members.findOne(id)

  const memberHasOwnPin = (() => member && member.pin != undefined)()

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
    const pinValid = member.pin == pin
    debug('pinValid: ', pinValid)
    validPin.set(pinValid)
    return pinValid
  }

  function setPin(pin) {
    debug('setting custom pin: ', pin)
    Meteor.call('members.setPin', member._id, pin)
    setPinSuccess.set(true)
  }
  
  function changeAvatar(avatar){
    debug('changing avatar', avatar)
    Meteor.call('members.changeAvatar', member._id, avatar)
    // setPinSuccess.set(true)
  }
  
  function clearPin() {
    debug('clearingPin:')
    validPin.set(false)
    setPinSuccess.set(false)
  }
  
  function forgotPin(method,destination) {
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
    onSubmitPin,
    setPin,
    validPin: validPin.get(),
    clearPin,
    forgotPin,
    setPinSuccess: setPinSuccess.get(),
    changeAvatar,
  }
})(MemberDash)