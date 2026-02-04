import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import ListUsers from './user-admin'
import CONSTANTS from '/imports/api/constants'
import { meteorCall } from '/imports/ui/utils/meteor'

const deleteUsers = (id) => meteorCall('deleteUsers', 'Deleting', id)
const updateUser = (user) =>
  meteorCall('updateUser', 'Updating', user)
const addNewUser = (username, email, password) =>
  meteorCall('addNewUser', 'Adding', {
    username,
    email,
    password,
  })
const setPassword = (id, newPassword) => {
  return meteorCall('setPassword', 'Set password', {
    id,
    newPassword,
  })
}
const sendResetPasswordEmail = (id) =>
  meteorCall('sendResetPasswordEmail', 'Reset password', id)

const userColumns = [
  {
    field: 'username',
    headerName: 'Username',
    flex: 1,
    editable: true
  },
  {
    field: 'emails',
    headerName: 'Email',
    flex: 1,
    editable: true
  },
]

CONSTANTS.ROLES.forEach((role) => {
  userColumns.push({
    field: role,
    headerName: role,
    type: 'boolean',
    editable: true,
    align: 'center',
    headerAlign: 'center',
    width: 110,
  })
})

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const usersSubscription = Meteor.subscribe('getAllUsers')

  return {
    users: Meteor.users
      .find({})
      .fetch()
      .map((item) => {
        if (item.roles) {
          item.roles.forEach((role) => {
            item[role._id] = true
          })
        }
        item.emails = item.emails[0].address
        return item
      }),
    usersReady: usersSubscription.ready(),
    userColumns,
    deleteUsers,
    updateUser,
    addNewUser,
    setPassword,
    sendResetPasswordEmail,
  }
})(ListUsers)
