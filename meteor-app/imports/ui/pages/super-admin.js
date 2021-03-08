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
    formatter: 'rowSelection',
    align: 'center',
    headerSort: false,
    width: 30,
    cellClick: function (e, cell) {
      cell.getRow().toggleSelect()
    },
  },
  {
    field: 'username',
    title: 'Username',
    editor: 'input',
    headerFilter: 'input',
  },
  {
    field: 'emails',
    title: 'Email',
    editor: 'input',
    headerFilter: 'input',
  },
]

CONSTANTS.ROLES.forEach((role) => {
  userColumns.push({
    field: role,
    title: role,
    formatter: 'tickCross',
    headerVertical: 'flip',
    editor: true,
    align: 'center',
    width: 40,
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
