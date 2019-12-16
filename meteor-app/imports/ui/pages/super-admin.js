import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Container, Table, Header, Loader, Confirm } from 'semantic-ui-react'
import { Stuffs } from '/imports/api/stuff/stuff'
import StuffItem from '/imports/ui/components/stuff-item'
import { withTracker } from 'meteor/react-meteor-data'
import ListStuff from './user-admin'
import CONSTANTS from '/imports/api/constants'

const deleteUsers = id => Meteor.call('deleteUsers', id)
const updateUser = user => Meteor.call('updateUser', user)
const addNewUser = func => Meteor.call('addNewUser', func)
const setPassword = (id, newPassword) => Meteor.call('setPassword', id, newPassword)
const sendResetPasswordEmail = id => Meteor.call('sendResetPasswordEmail', id)

const userColumns = [
  {
    formatter: 'rowSelection',
    align: 'center',
    headerSort: false,
    width: 30,
    cellClick: function(e, cell) {
      cell.getRow().toggleSelect()
    }
  },
  { field: 'username', title: 'Username', editor: 'input', headerFilter: 'input' },
  { field: 'emails', title: 'Email', editor: 'input', headerFilter: 'input' }
]

CONSTANTS.ROLES.forEach(role => {
  userColumns.push({
    field: role,
    title: role,
    formatter: 'tickCross',
    editor: true,
    align: 'center',
    width: 110
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
      .map(item => {
        if (item.roles) {
          item.roles.forEach(role => {
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
    sendResetPasswordEmail
  }
})(ListStuff)
