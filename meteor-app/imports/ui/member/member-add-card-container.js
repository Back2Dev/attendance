import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import Members from '/imports/api/members/schema'
import MemberAddCard from './member-add-card'

const debug = require('debug')('b2b:addcard')
import Alert from '/imports/ui/utils/alert'

export default withTracker(props => {
  const id = props.match.params.id
  const membersHandle = Meteor.subscribe('member', id)
  const loading = !membersHandle.ready()
  const member = Members.findOne(id)

  return {
    member
  }
})(MemberAddCard)
