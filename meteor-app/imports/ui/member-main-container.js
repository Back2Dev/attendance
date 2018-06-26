import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'
import { debounce, escapeRegExp } from 'lodash'

import MemberMain from '/imports/ui/member-main'
import Members from '/imports/api/members/members';

Session.set('searchQuery', '')

export default withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members')
  
  // prevents search filter from persisting after checkin / out
  if (!membersHandle.ready()) {
    Session.set('searchQuery', '')
  }

  const filter = (query) => {
    const searching = query != ''
    if (searching) {
      return {
        name: { $regex: new RegExp(escapeRegExp(query)), $options: 'i' },
        isHere: false
      }
    } else {
      return { isHere: false }
    }
  }

  return {
    membersIn: Members.find({
      isHere: true,
    }, { sort: { joined: -1, lastIn: -1, name: 1 } }).fetch(),
    membersOut: Members.find(
      filter(Session.get('searchQuery')), {
        sort: {
          sessionCount: -1,
        },
      },
    ).fetch(),
    loading: !membersHandle.ready(),
    searchQuery: Session.get('searchQuery'),
  }
})(MemberMain)
