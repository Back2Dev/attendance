import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import MemberAdd from '/imports/ui/member/member-add'
import { ReactiveVar } from 'meteor/reactive-var'

const success = new ReactiveVar(false)
const error = new ReactiveVar({ error: false, msg: '' })

export default withTracker((props) => {
  const addMember = (formData) => {
    Meteor.call('members.insert', formData, (err, res) => {
      if (err) {
        error.set({ error: true, msg: 'error' })
        success.set(false)
      }
      if (!err && res != undefined) {
        success.set(true)
        error.set({ error: false, msg: '' })
      }
    })
  }

  return {
    addMember,
    error: error.get(),
    success: success.get(),
  }
})(MemberAdd)