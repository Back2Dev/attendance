import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import MemberAdd from '/imports/ui/member/member-add'
import { Session } from 'meteor/session'

export default withTracker((props) => {

  const addMember = (formData) => {
    Meteor.call('members.insert', formData, (error, result) => {
      if (error) {
        Session.set('errorMessage', 'Error inserting new member.')
      }
      console.log({error, result})
    })
  }

  return {
    addMember,
    errorMessage: Session.get('errorMessage'),
  }
})(MemberAdd)