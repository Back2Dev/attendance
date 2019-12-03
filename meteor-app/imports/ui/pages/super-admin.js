import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Container, Table, Header, Loader, Confirm } from 'semantic-ui-react'
import { Stuffs } from '/imports/api/stuff/stuff'
import StuffItem from '/imports/ui/components/stuff-item'
import { withTracker } from 'meteor/react-meteor-data'
import ListStuff from './user-admin'
import MultiSelectEditor from 'react-tabulator/lib/editors/MultiSelectEditor'
import { reactFormatter } from 'react-tabulator'

const addANewRole = id => Meteor.call('addANewRole', id)
const removeARole = id => Meteor.call('removeARole', id)

const updateUserRoles = user => Meteor.call('updateUserRoles', user)

const userColumns = [
  {
    formatter: 'rowSelection',
    align: 'center',
    headerSort: false,
    cellClick: function(e, cell) {
      cell.getRow().toggleSelect()
    }
  },
  { field: 'username', title: 'Username', editor: true, headerFilter: 'input' },
  { field: 'emails', title: 'Email', headerFilter: 'input' },
  { field: 'roles', title: 'Roles', editor: MultiSelectEditor, headerFilter: 'input' }
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
    updateUserRoles
  }
})(ListStuff)
