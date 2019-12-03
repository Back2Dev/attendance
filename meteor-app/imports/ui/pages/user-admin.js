import React from 'react'
import PropTypes from 'prop-types'
import { Container, Table, Header, Loader, Segment, Button, Confirm } from 'semantic-ui-react'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/tabulator.min.css'
import { ReactTabulator } from 'react-tabulator'
import { Roles } from 'meteor/alanning:roles'

export default ListStuff = props => {
  let rows = props.users.map(({ _id: id, username: username, emails: emails, roles: roles }) => {
    let roleString = []
    Array.prototype.forEach.call(roles, role => {
      roleString.push(role._id)
    })
    return { _id: id, username: username, emails: emails[0].address, roles: roleString }
  })

  let newUsers = [...props.users]
  let rolesForOptions = props.roles.map(role => role._id)
  const [users, setusers] = React.useState(rows)
  const [roles, setRoles] = React.useState(props.roles)
  const [popupStatus, setPopupStatus] = React.useState(false)
  const [usersRowsSelected, setUsersRowsSelected] = React.useState([])
  const [rolesRowsSelected, setRolesRowsSelected] = React.useState([])

  const deleteUsers = () => {
    usersRowsSelected.forEach(userData => props.deleteUsers(userData))
  }

  show = () => setPopupStatus(true)
  handleConfirm = () => setPopupStatus(false)

  let textValue = ''
  const handleChange = value => (textValue = value.target.value)

  const addANewRole = () => {
    props.addANewRole(textValue)
  }

  const deleteRoles = () => {
    rolesRowsSelected.forEach(roleData => {
      props.removeARole(roleData)
      newUsers = newUsers.map(newUser => {
        newUser.roles = newUser.roles.filter(role => role._id !== roleData)
        return newUser
      })
    })
    newUsers.forEach(newUser => props.updateUserRoles(newUser))
  }

  React.useEffect(() => {
    setusers(rows)
    setRoles(props.roles)
    setUsersRowsSelected([])
    setRolesRowsSelected([])
    rolesForOptions = props.roles.map(role => role._id)
  }, [props.users, props.roles])

  const usersOnCellEdited = cell => {
    const newUser = { ...cell._cell.row.data }
    delete newUser.emails
    newUser.roles = newUser.roles.map(role => ({ _id: role.id, scope: null, assigned: true }))
    props.updateUser(newUser)
  }

  const usersTableOptions = {
    cellEdited: usersOnCellEdited,
    width: 100,
    rowSelected: function(row) {
      usersRowsSelected.push(row._row.data._id)
    },
    rowDeselected: function(row) {
      for (i = 0; i < usersRowsSelected.length; i++) {
        if (usersRowsSelected[i] === row._row.data._id) {
          usersRowsSelected.splice(i, 1)
        }
      }
    }
  }

  const rolesTableOptions = {
    width: 100,
    rowSelected: function(row) {
      rolesRowsSelected.push(row._row.data._id)
    },
    rowDeselected: function(row) {
      for (i = 0; i < rolesRowsSelected.length; i++) {
        if (rolesRowsSelected[i] === row._row.data._id) {
          rolesRowsSelected.splice(i, 1)
        }
      }
    }
  }

  let UsersContents = () => <Loader active>Getting data</Loader>
  if (props.usersReady && props.rolesReady) {
    if (!users.length) {
      UsersContents = () => <span>No data found</span>
    } else {
      UsersContents = () => (
        <ReactTabulator columns={props.userColumns(rolesForOptions)} data={users} options={usersTableOptions} />
      )
    }
  }

  let RolesContents = () => <Loader active>Getting data</Loader>
  if (props.rolesReady) {
    if (!users.length) {
      RolesContents = () => <span>No data found</span>
    } else {
      RolesContents = () => (
        <div>
          <ReactTabulator columns={props.roleColumns} data={roles} options={rolesTableOptions} />

          <div className="ui action input" style={{ float: 'right', right: '0px' }}>
            <input type="text" onChange={handleChange} size={45} />
            <button className="ui button" onClick={addANewRole}>
              Create Role
            </button>
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      <Segment>
        Account Admin
        <span style={{ float: 'right', right: '0px' }}>
          <Button size="mini" onClick={deleteUsers} color="red" type="button">
            Delete
          </Button>
          <Button size="mini" onClick={show} color="grey" type="button">
            Manage Roles
          </Button>
        </span>
      </Segment>
      <Confirm
        open={popupStatus}
        header="Update Roles"
        content={<RolesContents />}
        onConfirm={handleConfirm}
        confirmButton="Done"
        onCancel={deleteRoles}
        cancelButton="Delete"
      />
      <UsersContents />
    </div>
  )
}

/** Require an array of Stuff documents in the props. */
ListStuff.propTypes = {
  users: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  usersReady: PropTypes.bool.isRequired,
  rolesReady: PropTypes.bool.isRequired,
  userColumns: PropTypes.func,
  roleColumns: PropTypes.array.isRequired,
  addANewRole: PropTypes.func,
  removeARole: PropTypes.func,
  updateUserRoles: PropTypes.func,
  deleteUsers: PropTypes.func
}
