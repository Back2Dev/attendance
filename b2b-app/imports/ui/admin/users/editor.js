import React from 'react'
import { useParams } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import LinearProgress from '@mui/material/LinearProgress'
import Profiles from '/imports/api/profiles/schema'
import Messages from '/imports/api/messages/schema'

import UserEditTabs from './edit.js'
import { meteorCall } from '/imports/ui/utils/meteor'
import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'

const Editor = () => {
  const { userId } = useParams()

  const { user, member, messages, loading } = useTracker(() => {
    const userSub = Meteor.subscribe('getUser', userId)
    const member = Profiles.findOne({ userId })
    const user = Meteor.users.findOne({ _id: userId })
    if (user) {
      user.roles = Roles.getRolesForUser(user)
    }
    const messages = Messages.find({}).fetch()
    return { user, member, messages, loading: !userSub.ready() }
  }, [userId])

  const setPassword = async ({ newPassword }) =>
    meteorCall('setUserPassword', 'Set password', {
      id: user?._id,
      newPassword,
    })

  const sendResetPasswordEmail = async () => {
    const { status, message } = await meteorCall(
      'sendResetPasswordEmail',
      'Reset password',
      user?.username
    )
    if (status === 'failed') {
      showError(message)
    }
  }

  const sendConfirmationEmail = async () => {
    const { status, message } = await meteorCall('reinviteUser', 'Reinvite user', user?._id)
    if (status === 'failed') {
      showError(message)
    }
  }

  const editUser = async (form) => {
    const { status, message } = await meteorCall('update.profiles', null, form)
    if (status === 'success') {
      showSuccess(message)
    } else {
      showError(message)
    }
  }

  const suspendProfile = () => meteorCall('suspend.member', 'Setting status', member?._id)

  const setActiveProfile = () => meteorCall('set.active.member', 'Setting status', member?._id)

  if (loading || !user || !member) return <LinearProgress />

  return (
    <UserEditTabs
      user={user}
      member={member}
      messages={messages}
      editUser={editUser}
      setPassword={setPassword}
      sendResetPasswordEmail={sendResetPasswordEmail}
      sendConfirmationEmail={sendConfirmationEmail}
      suspendProfile={suspendProfile}
      setActiveProfile={setActiveProfile}
    />
  )
}

export default Editor
