import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import LinearProgress from '@material-ui/core/LinearProgress'
import Members from '/imports/api/members/schema'
import Messages from '/imports/api/messages/schema'

import UserEditTabs from './edit.js'
import { meteorCall } from '/imports/ui/utils/meteor'
import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'

const Loading = (props) => {
  if (props.loading) return <LinearProgress />
  return <UserEditTabs {...props}></UserEditTabs>
}
export default withTracker((props) => {
  const { userId } = props.match.params
  const userSub = Meteor.subscribe('getUser', userId)
  const member = Members.findOne({ userId })
  const user = Meteor.users.findOne({ _id: userId })
  if (user) {
    user.roles = Roles.getRolesForUser(user)
  }
  const messages = Messages.find({}).fetch()

  const setPassword = async ({ newPassword }) => {
    return await meteorCall('setUserPassword', 'Set password', {
      id: user._id,
      newPassword,
    })
  }

  const sendResetPasswordEmail = async () => {
    const { status, message } = await meteorCall(
      'sendResetPasswordEmail',
      'Reset password',
      user.username
    )
    if (status === 'failed') {
      showError(message)
    }
  }

  const sendConfirmationEmail = async () => {
    const { status, message } = await meteorCall(
      'reinviteUser',
      'Reinvite user',
      user._id
    )
    if (status === 'failed') {
      showError(message)
    }
  }

  const editUser = async (form) => {
    const { status, message } = await meteorCall('update.members', null, form)
    if (status === 'success') {
      showSuccess(message)
    } else {
      showError(message)
    }
  }

  const suspendProfile = () => meteorCall('suspend.member', 'Setting status', member._id)

  const setActiveProfile = () =>
    meteorCall('set.active.member', 'Setting status', member._id)

  console.log('ready:', userSub.ready(), member, user)
  return {
    user,
    member,
    messages,
    loading: !userSub.ready(),
    editUser,
    setPassword,
    sendResetPasswordEmail,
    sendConfirmationEmail,
    suspendProfile,
    setActiveProfile,
  }
})(Loading)
