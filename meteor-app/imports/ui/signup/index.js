import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Members from '/imports/api/members/schema'
import Main from './main'

const debug = require('debug')('b2b:visit')

export default withTracker(props => {
  const id = props.match.params.id
  const membersHandle = Meteor.subscribe('member.all', id)
  const member = Members.findOne(id) || {}
  // console.log(member)
  const usersSubscription = Meteor.subscribe('getAllUsers')
  const users = Meteor.users.find({}).fetch()

  let existUser = false
  users.map(user => {
    if (user.username === member.email) {
      return (existUser = true)
    }
  })
  return {
    existUser,
    usersReady: usersSubscription.ready(),
    member
  }
})(Main)
