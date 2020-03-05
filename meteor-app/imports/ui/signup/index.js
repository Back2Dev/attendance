import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Members from '/imports/api/members/schema'
import Signup from './main'
import React from 'react'
import Alert from 'react-s-alert'
import Login from '/imports/ui/pages/login'

const Loading = props => {
  if (props.loading) {
    return <div>Loading...</div>
  } else if (!props.member._id) {
    return <div>User not found ...</div>
  } else if (props.checkUser.length > 0) {
    Alert.error("Looks like you've already registered..Please Sign In")
    return (
      <div>
        <Login />
        <p>If you believe this to be a mistake, please contact your administrator</p>
      </div>
    )
  }
  return <Signup {...props}></Signup>
}

export default withTracker(props => {
  const id = props.match.params.id
  const membersHandle = Meteor.subscribe('member.all', id)
  const member = Members.findOne(id) || {}
  const usersSubscription = Meteor.subscribe('getAllUsers')
  const checkUser = Meteor.users.find({ username: member.email }).fetch()

  const add = form =>
    Meteor.call('addNewMemberUser', form.email, form.password, member._id, function(error, result) {
      if (result === 'success') {
        props.history.push('/login')
      } else {
        console.log(error)
      }
    })

  return {
    checkUser,
    add,
    member,
    loading: !membersHandle.ready() && !usersSubscription.ready()
  }
})(Loading)
