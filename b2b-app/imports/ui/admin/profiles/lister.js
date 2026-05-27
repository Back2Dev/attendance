/* global Roles */
import React from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import ListUsers from './list'
import CONSTANTS from '/imports/api/constants'
import { meteorCall } from '/imports/ui/utils/meteor'
import { accessByPath } from '/imports/api/util'

const deleteUsers = (id) => meteorCall('deleteUsers', 'Deleting', id)
const updateUser = (user) => meteorCall('updateUser', 'Updating', user)
const addNewUser = (form) => meteorCall('addNewUser', 'Adding', form)
const setPassword = (id, newPassword) => {
  return meteorCall('setUserPassword', 'Set password', { id, newPassword })
}
const sendResetPasswordEmail = (id) =>
  meteorCall('sendResetPasswordEmail', 'Reset password', id)

const userColumns = [
  {
    formatter: 'rowSelection',
    align: 'center',
    headerSort: false,
    width: 30,
    cellClick: function (e, cell) {
      cell.getRow().toggleSelect()
    },
  },
  { field: 'username', title: 'Username', editor: 'input', headerFilter: 'input' },
  { field: 'emails', title: 'Email', editor: 'input', headerFilter: 'input' },
]

Object.keys(CONSTANTS.ROLES).forEach((role) => {
  userColumns.push({
    field: role,
    title: CONSTANTS.ROLES[role],
    formatter: 'tickCross',
    headerVertical: 'flip',
    editor: true,
    align: 'center',
    width: 40,
  })
})

const ProfilesLister = (props) => {
  const { users, loading } = useTracker(() => {
    const usersSubscription = Meteor.subscribe('getAllUsers')
    const users = Meteor.users
      .find({})
      .fetch()
      .map((item) => {
        const roles = Roles.getRolesForUser(item)
        if (roles) {
          roles.forEach((role) => {
            item[role] = true
          })
        }
        if (accessByPath(item, 'emails.0.address')) item.emails = item.emails[0].address
        return item
      })
    return { users, loading: !usersSubscription.ready() }
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <ListUsers
      {...props}
      users={users}
      userColumns={userColumns}
      deleteUsers={deleteUsers}
      updateUser={updateUser}
      setPassword={setPassword}
      sendResetPasswordEmail={sendResetPasswordEmail}
    />
  )
}

export default ProfilesLister
