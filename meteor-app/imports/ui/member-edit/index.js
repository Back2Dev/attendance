import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
const debug = require('debug')('b2b:member-edit')
import Members from '/imports/api/members/schema'
import MemberEdit from './edit'

export default withTracker(props => {
  const id = props.match.params.id
  const membersHandle = Meteor.subscribe('member', id)
  const loading = !membersHandle.ready()
  const member = Members.findOne(id)

  function cancelClick() {
    props.history.goBack()
  }

  return {
    loading,
    member,
    cancelClick
  }
})(MemberEdit)
