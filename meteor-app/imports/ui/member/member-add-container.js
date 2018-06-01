import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import MemberAdd from '/imports/ui/member/member-add'
import { ReactiveVar } from 'meteor/reactive-var'
import isIframe from '/imports/helpers/isIframe'

const success = new ReactiveVar(false)
const error = new ReactiveVar(false)
const msg = new ReactiveVar('')


export default withTracker((props) => {
  const addMember = (formData) => {
    Meteor.call('members.insert', formData, (err, res) => {
      if (err) {
        error.set(true)
        success.set(false)
        console.log(err)
        msg.set(err.reason)
      }
      if (!err && res != undefined) {
        success.set(true)
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
  }
})(MemberAdd)