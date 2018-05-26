import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'
import MemberMain from '/imports/ui/main'
import Members from '/imports/api/members/members';
import { debounce } from 'lodash'
import { ReactiveVar } from 'meteor/reactive-var'

const query = new ReactiveVar()

export default withTracker((props) => {
  const membersHandle = Meteor.subscribe('all.members')

  if (!membersHandle.ready()) {
    // prevents search filter from persisting after checkin / out
    query.set('')
  }

  const onSearchInput = q => query.set(q.target.value)

  const filter = (query) => {
    const searching = query != ''
    if (searching) {
      return {
        name: { $regex: new RegExp(query), $options: 'i' },
        isHere: false
      }
    } else {
      return { isHere: false }
    }
  }

  return {
    membersIn: Members.find({ isHere: true }).fetch(),
    membersOut: Members.find(filter(query.get())).fetch(),
    loading: !membersHandle.ready(),
    searchQuery: query.get(),
    onSearchInput,
  }
})(MemberMain)
