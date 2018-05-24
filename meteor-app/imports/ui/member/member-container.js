import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'
import MemberMain from '/imports/ui/main'
import Members from '/imports/api/members/members';
import { debounce } from 'lodash'

export default withTracker((props) => {
  let membersHandle

  const onSearchInput = q => {
    debounce( () => Session.set('searchQuery', q) , 300)() 
  }

  if (Session.get('searchQuery') == '') {
    membersHandle = Meteor.subscribe('all.members')
  } else {
    membersHandle = Meteor.subscribe('members.search', Session.get('searchQuery'))
  }


  return {
    membersIn: Members.find({ isHere: true }).fetch(),
    membersOut: Members.find({isHere: false}).fetch(),
    loading:!membersHandle.ready(),
    onSearchInput,
  }
})(MemberMain)