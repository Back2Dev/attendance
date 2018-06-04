import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
const debug = require('debug')('att:visit')
import { ReactiveVar } from 'meteor/reactive-var'
import MemberVisit from '/imports/ui/member/member-visit'
import Members from '/imports/api/members/members'

const validPin = new ReactiveVar(false)

export default withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members')
  const loading = !membersHandle.ready()
  const id = props.match.params.id
  const member = Members.findOne(id)

  function onPinChange(e){
    const valid = e.target.value == '123'
    validPin.set(valid)
  }

  function recordVisit({duration}) {
    if (!member.isHere) {
      debug('member arriving', id, duration)
      Meteor.call('arrive', id, duration)
    } else {
      debug('member departure', id)
      Meteor.call('depart', id)
    }
  }

  return {
    recordVisit,
    loading,
    member,
    onPinChange,
    validPin: pin.get()
  }
})(MemberVisit)