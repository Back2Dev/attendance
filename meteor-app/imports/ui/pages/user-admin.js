import React from 'react'
import PropTypes from 'prop-types'
import {
  Loader,
  Segment,
  Button,
  Confirm,
  Form,
  Popup,
  Grid,
  Divider,
} from 'semantic-ui-react'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/tabulator.min.css'
import { ReactTabulator } from 'react-tabulator'
import CONSTANTS from '/imports/api/constants'
import Alert from '/imports/ui/utils/alert'
import AddUserModal from './add-user-modal'

export default ListUsers = (props) => {
  const [users, setusers] = React.useState(props.users)
  const [popupStatus, setPopupStatus] = React.useState(false)
  const [usersRowsSelected, setUsersRowsSelected] = React.useState([])
  const [passwordError, setPasswordError] = React.useState('')

  React.useEffect(() => {
    setusers(props.users)
    setUsersRowsSelected([])
  }, [props.users])

  const addNewUser = (username, email, password) => {
    props.addNewUser(username, email, password)
  }

  const deleteUsers = () => {
    usersRowsSelected.forEach((userData) =>
      props.deleteUsers(userData)
    )
  }

  const show = () => {
    if (usersRowsSelected.length === 0) {
      Alert.error('Please select a user to manage')
    } else {
      if (usersRowsSelected.length === 1) {
        setPopupStatus(true)
      } else {
        Alert.error('Please select only one user to manage')
      }
    }
  }
  const handleCancel = () => {
    setPasswordError('')
    setPopupStatus(false)
    setUsersRowsSelected([])
  }

  const handleSendEmail = () => {
    props.sendResetPasswordEmail(usersRowsSelected[0])
    setPopupStatus(false)
    setUsersRowsSelected([])
    setPasswordError('')
    Alert.success('Email has been sent')
  }

  let newPassword = ''
  let newPasswordAgain = ''

  const handleChange = (value) => {
    switch (value.target.placeholder) {
      case 'New Password':
        newPassword = value.target.value
        break
      case 'New Password Again':
        newPasswordAgain = value.target.value
        break
    }
  }

  const handleSave = async () => {
    if (newPassword === newPasswordAgain && newPassword) {
      const s = await props.setPassword(
        usersRowsSelected[0],
        newPassword
      )
      if (s.status === 'success') {
        setPopupStatus(false)
        setUsersRowsSelected([])
      }
    } else {
      setPasswordError('Passwords must be the same')
    }
  }

  const usersOnCellEdited = (cell) => {
    const newUser = { ...cell._cell.row.data }
    newUser.roles = newUser.roles.map((role) => ({
      _id: role,
      scope: null,
      assigned: true,
    }))
    if (cell._cell.column.field === 'emails') {
      newUser.oldValue = cell._cell.oldValue
    }
    newUser.roles = CONSTANTS.ROLES.filter((role) => newUser[role])
    props.updateUser(newUser)
  }

  const usersTableOptions = {
    cellEdited: usersOnCellEdited,
    width: 100,
    rowSelected: function (row) {
      usersRowsSelected.push(row._row.data._id)
    },
    rowDeselected: function (row) {
      for (i = 0; i < usersRowsSelected.length; i++) {
        if (usersRowsSelected[i] === row._row.data._id) {
          usersRowsSelected.splice(i, 1)
        }
      }
    },
  }

  let UsersContents = () => <Loader active>Getting data</Loader>
  if (props.usersReady) {
    if (!users.length) {
      UsersContents = () => <span>No data found</span>
    } else {
      UsersContents = () => (
        <ReactTabulator
          columns={props.userColumns}
          data={users}
          options={usersTableOptions}
        />
      )
    }
  }

  let ManagePasswordContents = () => (
    <Segment>
      <Grid columns={2} relaxed="very">
        <Grid.Column
          verticalAlign="middle"
          style={{ textAlign: 'center' }}
        >
          <Button
            onClick={handleSendEmail}
            content="Send Reset Password Email"
          />
        </Grid.Column>
        <Grid.Column>
          <Form>
            <Form.Input
              type="password"
              label="New Password"
              placeholder="New Password"
              onChange={handleChange}
            />
            <Form.Input
              type="password"
              label="New Password Again"
              placeholder="New Password Again"
              onChange={handleChange}
            />
            <div style={{ padding: 0, color: 'red' }}>
              {passwordError}
            </div>
          </Form>
        </Grid.Column>
      </Grid>

      <Divider vertical>Or</Divider>
    </Segment>
  )

  return (
    <div>
      <Segment>
        <Alert stack={{ limit: 3 }} />
        Account Admin
        <span style={{ float: 'right', right: '0px' }}>
          <AddUserModal addNewUser={addNewUser} />
          <Button
            size="mini"
            onClick={deleteUsers}
            color="red"
            type="button"
          >
            Delete
          </Button>
          <Popup
            content="Select one row before using this function"
            disabled={false}
            trigger={
              <Button
                size="mini"
                onClick={show}
                color="grey"
                type="button"
              >
                Manage Password
              </Button>
            }
          />
        </span>
      </Segment>
      <Confirm
        open={popupStatus}
        header="Manage Password"
        content={<ManagePasswordContents />}
        onConfirm={handleSave}
        onCancel={handleCancel}
      />
      <UsersContents />
    </div>
  )
}

/** Require an array of Stuff documents in the props. */
ListUsers.propTypes = {
  users: PropTypes.array.isRequired,
  usersReady: PropTypes.bool.isRequired,
  userColumns: PropTypes.array.isRequired,
  deleteUsers: PropTypes.func,
  addNewUser: PropTypes.func,
  setPassword: PropTypes.func,
  sendResetPasswordEmail: PropTypes.func,
}
