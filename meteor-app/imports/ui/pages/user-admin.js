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
import { DataGrid } from '@mui/x-data-grid'
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

  const processRowUpdate = async (newRow, oldRow) => {
    const newUser = { ...newRow }
    if (newRow.emails !== oldRow.emails) {
      newUser.oldValue = oldRow.emails
    }
    newUser.roles = CONSTANTS.ROLES.filter((role) => newUser[role])
    await props.updateUser(newUser)
    return newRow
  }

  let UsersContents = () => <Loader active>Getting data</Loader>
  if (props.usersReady) {
    if (!users.length) {
      UsersContents = () => <span>No data found</span>
    } else {
      UsersContents = () => (
        <div style={{ width: '100%' }}>
          <DataGrid
            rows={users}
            columns={props.userColumns}
            checkboxSelection
            rowSelectionModel={usersRowsSelected}
            onRowSelectionModelChange={(model) =>
              setUsersRowsSelected(model)
            }
            getRowId={(row) => row._id}
            editMode="cell"
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(err) =>
              Alert.error(err?.message || 'Failed to update user')
            }
            autoHeight
          />
        </div>
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
