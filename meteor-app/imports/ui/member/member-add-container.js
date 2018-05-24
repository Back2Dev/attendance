import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import MemberAdd from '/imports/ui/member/member-add'
import { Session } from 'meteor/session'

export default withTracker((props) => {

  const addMember = (formData) => {
    Meteor.call('members.insert', formData, (err, res) => {
      if (err) {
        Session.set('errorMessage', err.reason)
      }
      if(!err && res != undefined){
        Session.set('errorMessage', '')
      }
    })
  }

  return {
    addMember,
    errorMessage: Session.get('errorMessage'),
  }
})(MemberAdd)