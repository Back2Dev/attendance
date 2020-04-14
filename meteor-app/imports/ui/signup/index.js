import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Members from '/imports/api/members/schema'
import Signup from './main'
import React from 'react'
import Alert from 'react-s-alert'

const Loading = (props) => {
  if (props.loading) {
    return <div>Loading...</div>
  } else if (!props.member._id) {
    return <div>User not found ...</div>
  } else if (props.existingUser) {
    return (
      <>
        {props.history.push('/login')}
        {Alert.info("Looks like you've already registered... Please sign In")}
      </>
    )
  } else {
    return <Signup {...props}></Signup>
  }
}

export default withTracker((props) => {
  const id = props.match.params.id
  const membersHandle = Meteor.subscribe('member.all', id)
  const member = Members.findOne(id) || {}
  const usersSubscription = Meteor.subscribe('getAllUsers')
  const checkUser = Meteor.users.find({ username: member.email }).fetch()
  const existingUser = checkUser.length > 0 ? true : false

  const add = async (form) => {
    const userData = await Meteor.callAsync('addUser', form.email, form.password, member._id)
    const result = await Meteor.callAsync('members.userid.update', member._id, { ...member, userId: userData.id })
    if (result == 'success') {
      console.debug('registered')
      return props.history.push('/login')
    } else {
      return Alert.error(result.message)
    }
  }

  const forgotPin = (method, destination) => {
    Meteor.call('members.forgotPin', member._id, method, destination)
  }

  return {
    checkUser,
    add,
    member,
    forgotPin,
    loading: !membersHandle.ready() && !usersSubscription.ready(),
    existingUser,
  }
})(Loading)
