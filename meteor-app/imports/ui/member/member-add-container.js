import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import MemberAdd from '/imports/ui/member/member-add'
import { ReactiveVar } from 'meteor/reactive-var'
import isIframe from '/imports/helpers/isIframe'

const success = new ReactiveVar(false)
const error = new ReactiveVar(false)
const msg = new ReactiveVar('')
const newId = new ReactiveVar('')

export default withTracker(() => {
  const addMember = (formData) => {
    return Meteor.call('members.insert', formData, (err, res) => {
      if (err) {
        newId.set('')
        error.set(true)
        success.set(false)
        msg.set(err.reason)
      }
      if (!err && res != undefined) {
        success.set(true)
        newId.set(res)
        error.set(false)
        msg.set('Successfully added new volunteer')
      }
    })
  }

  return {
    addMember,
    error: error.get(),
    success: success.get(),
    message: msg.get(),
    isIframe: isIframe(),
    newId: newId.get(),
    resetId: () => newId.set(''),
  }
})(MemberAdd)
