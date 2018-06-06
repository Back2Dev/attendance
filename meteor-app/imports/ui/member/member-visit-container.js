import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
const debug = require('debug')('att:visit')
import { ReactiveVar } from 'meteor/reactive-var'
import MemberVisit from '/imports/ui/member/member-visit'
import Members from '/imports/api/members/members'

const validPin = new ReactiveVar(false)
const setPinSuccess = new ReactiveVar(false)

export default withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members')
  const loading = !membersHandle.ready()
  const id = props.match.params.id
  const member = Members.findOne(id)

  const memberHasOwnPin = (() => member.pin != undefined)()

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
    //if they have their own pin
    // if they dont
    if (memberHasOwnPin) {
      const pinValid = member.pin == pin
      validPin.set(pinValid)
      return pinValid
    } else {
      debug('setting custom pin: ', pin)
      Meteor.call('members.setPin', member._id, pin)
      setPinSuccess.set(true)

    }
  }

  function clearPin() {
    validPin.set(false)
    setPinSuccess.set(false)
  }

function forgotPin(){
  // redirect to forgot PIN screen
  debug('forgotten pin: ', member._id)
}

  return {
    recordVisit,
    loading,
    member,
    cancelClick,
    memberHasOwnPin,
    onSubmitPin,
    validPin: validPin.get(),
    clearPin,
    forgotPin,
    setPinSuccess: setPinSuccess.get()
  }
})(MemberVisit)