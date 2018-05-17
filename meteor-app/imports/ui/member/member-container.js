import { Meteor } from 'meteor/meteor'
import {withTracker} from 'meteor/react-meteor-data';
import MemberMain from '/imports/ui/main'
import Members from '/imports/api/members/members';


export default withTracker((props) => {

  const searchQuery = '';
  const onSearchInput = () => {
    console.log('searching...')
  }

  const membersIn = Members.find({isHere: true}).fetch()
  const membersOut = Members.find({isHere: false}).fetch()

  const membersHandle = Meteor.subscribe('all.members')
  const loading = ! membersHandle.ready()
  
  return {
    membersIn, 
    membersOut,
    loading,
    onSearchInput,
    searchQuery,
  }
})(MemberMain)