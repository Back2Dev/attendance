import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import MemberAdd from './member-add'
import Members from '/imports/api/members/members';

export default withTracker((props) => {

  const addMember = ({formData}) => {
    // proxy event gets sent through first, data follows in second call for some reason.
    if(formData != undefined){
      console.log(formData)
    }
  }

  return {
    addMember,
  }
})(MemberAdd)