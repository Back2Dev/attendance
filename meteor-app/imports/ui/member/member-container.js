import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'
import { debounce, escapeRegExp } from 'lodash'

import MemberMain from '/imports/ui/main'
import Members from '/imports/api/members/members';
const debug = require('debug')('att:search')

Session.set('query', '')

export default withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members')
  
  // prevents search filter from persisting after checkin / out
  if (!membersHandle.ready()) {
    Session.set('query', '')
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
    }, {
      sort: {
        sessionCount: -1,
      },
    }).fetch(),
    membersOut: Members.find(
      filter(Session.get('query')), {
        sort: {
          sessionCount: -1,
        },
      },
    ).fetch(),
    loading: !membersHandle.ready(),
    searchQuery: Session.get('query'),
  }
})(MemberMain)
