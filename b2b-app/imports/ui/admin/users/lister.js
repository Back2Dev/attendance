import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import LinearProgress from '@material-ui/core/LinearProgress'
import Members from '/imports/api/members/schema'
import ListUsers from './list'

const Loading = (props) => {
  if (props.loading) return <LinearProgress />
  return <ListUsers {...props}></ListUsers>
}
export default withTracker((props) => {
  // Get access to Stuff documents.
  const usersSubscription = Meteor.subscribe('getAllUsers')
  const members = Members.find({}).fetch()
  const userMembers = Meteor.users
    .find({})
    .fetch()
    .map((user) => {
      return {
        ...user,
        ...members.find((member) => member.userId === user._id),
      }
    })

  return {
    userMembers,
    loading: !usersSubscription.ready(),
  }
})(Loading)
