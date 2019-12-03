import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Container, Table, Header, Loader, Confirm } from 'semantic-ui-react'
import { Stuffs } from '/imports/api/stuff/stuff'
import StuffItem from '/imports/ui/components/stuff-item'
import { withTracker } from 'meteor/react-meteor-data'
import ListStuff from './user-admin'
import MultiValueFormatter from 'react-tabulator/lib/formatters/MultiValueFormatter'
import MultiSelectEditor from 'react-tabulator/lib/editors/MultiSelectEditor'
import { reactFormatter } from 'react-tabulator'

const addANewRole = id => Meteor.call('addANewRole', id)
const removeARole = id => Meteor.call('removeARole', id)

const updateUserRoles = user => Meteor.call('updateUserRoles', user)
const deleteUsers = id => Meteor.call('deleteUsers', id)
const updateUser = user => Meteor.call('updateUser', user)

const userColumns = roles => [
  {
    formatter: 'rowSelection',
    align: 'center',
    headerSort: false,
    cellClick: function(e, cell) {
      cell.getRow().toggleSelect()
    }
  },
  { field: 'username', title: 'Username', editor: 'input', headerFilter: 'input' },
  { field: 'emails', title: 'Email', headerFilter: 'input' },
  {
    field: 'roles',
    title: 'Roles',
    headerFilter: 'input',
    formatter: MultiValueFormatter,
    formatterParams: { style: 'PILL' },
    editor: MultiSelectEditor,
    editorParams: cell => {
      const values = roles.filter(role => !cell._cell.row.data.roles.includes(role))
      return { values: values.map(value => ({ id: value, name: value })) }
    }
  }
]

const roleColumns = [
  {
    formatter: 'rowSelection',
    align: 'center',
    headerSort: false,
    cellClick: function(e, cell) {
      cell.getRow().toggleSelect()
    }
  },
  { field: '_id', title: 'Roles' }
]
/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const rolesSubscription = Meteor.subscribe('getAllRoles')
  const usersSubscription = Meteor.subscribe('getAllUsers')

  return {
    roles: Meteor.roles.find({}).fetch(),
    users: Meteor.users.find({}).fetch(),
    usersReady: usersSubscription.ready(),
    rolesReady: rolesSubscription.ready(),
    userColumns,
    roleColumns,
    addANewRole,
    removeARole,
    updateUserRoles,
    deleteUsers,
    updateUser
  }
})(ListStuff)
