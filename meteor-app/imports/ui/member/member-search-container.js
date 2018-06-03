import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { Session } from 'meteor/session'
import MemberSearch from '/imports/ui/member/member-search'

export default withTracker((props) => {

  const onSearchInput = q => Session.set('searchQuery', q.target.value)
  
  return {
    onSearchInput,
    searchQuery: Session.get('searchQuery')
  }
})(MemberSearch)