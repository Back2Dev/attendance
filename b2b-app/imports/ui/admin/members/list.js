import React from 'react'
import PropTypes from 'prop-types'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/materialize/tabulator_materialize.min.css'
import { ReactTabulator } from 'react-tabulator'
import CONSTANTS from '/imports/api/constants'
import { showSuccess, showInfo, showError } from '/imports/ui/utils/toast-alerts'
import AddUser from '/imports/ui/components/add-user'
import { TabAppbar } from '/imports/ui/utils/generic'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'

const debug = require('debug')('se:user-admin')

const ListUsers = (props) => {
  const [users, setusers] = React.useState([])
  const [popupStatus, setPopupStatus] = React.useState(false)
  const [showUserModal, setShowUserModal] = React.useState(false)
  const [usersRowsSelected, setUsersRowsSelected] = React.useState([])
  const [passwordError, setPasswordError] = React.useState('')

  React.useEffect(() => {
    setusers(props.users)
  }, [props.users, usersRowsSelected])

  const deleteUsers = () => {
    usersRowsSelected.forEach((userData) => props.deleteUsers(userData))
  }

  const open = () => {
    if (usersRowsSelected.length === 0) {
      showError('Please select a user to manage')
    } else {
      if (usersRowsSelected.length === 1) {
        setPasswordError('')
        setPopupStatus(true)
      } else {
        showError('Please select only one user to manage')
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
    showSuccess('Email has been sent')
  }

  let newPassword = ''
  let newPasswordAgain = ''

  const handleChange = (value) => {
    switch (value.target.id) {
      case 'new-password':
        newPassword = value.target.value
        break
      case 'confirm-password':
        newPasswordAgain = value.target.value
        break
    }
  }

  const handleSave = async () => {
    if (newPassword === newPasswordAgain && newPassword) {
      const s = await props.setPassword(usersRowsSelected[0], newPassword)
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
    if (newUser.roles) {
      if (cell._cell.column.field === 'emails') {
        newUser.oldValue = cell._cell.oldValue
      }
      newUser.roles = Object.keys(CONSTANTS.ROLES).filter((role) => newUser[role])
      props.updateUser(newUser)
    } else {
      // edge case where user does not have a role.
      showInfo('adding new role to user')
      newUser.roles = Object.keys(CONSTANTS.ROLES).filter((role) => newUser[role])
      props.updateUser(newUser)
    }
  }

  const usersTableOptions = {
    cellEdited: usersOnCellEdited,
    width: 100,
    pagination: 'local',
    paginationSize: 10,
    rowSelected: function (row) {
      setUsersRowsSelected((prevArray) => [...prevArray, row._row.data._id])
    },
    rowDeselected: function (row) {
      for (let i = 0; i < usersRowsSelected.length; i++) {
        if (usersRowsSelected[i] === row._row.data._id) {
          usersRowsSelected.splice(i, 1)
          setUsersRowsSelected(usersRowsSelected)
        }
      }
    },
  }

  let ManagePasswordContents = () => (
    <Dialog
      open={popupStatus}
      onClose={() => setPopupStatus(false)}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <DialogTitle id="change-password-title">Change Password</DialogTitle>

      <DialogContent>
        <FormControl>
          <TextField
            id="new-password"
            type="password"
            label="New password"
            onChange={handleChange}
          />
          <TextField
            id="confirm-password"
            type="password"
            label="Confirm password"
            onChange={handleChange}
          />
        </FormControl>
      </DialogContent>
      <div style={{ color: 'red' }}>{passwordError}</div>
      <DialogActions>
        <Button onClick={handleSave} color="primary" variant="contained">
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  )

  let closeModal = () => {
    setShowUserModal(true)
  }

  let CreateNewUser = () => {
    return (
      <Dialog
        open={showUserModal}
        onClose={() => setShowUserModal(false)}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <DialogContent>
          <AddUser closeModal={() => setShowUserModal(false)} />
        </DialogContent>
      </Dialog>
    )
  }

  const add = () => {
    setShowUserModal(true)
  }

  const buttons = [
    { action: open, id: 'manage-password', caption: 'Manage password', color: 'primary' },
    { action: deleteUsers, id: 'delete', caption: 'Delete', color: 'secondary' },
    { action: add, id: 'add', caption: 'Add', color: 'primary' },
  ]

  return (
    <div>
      <TabAppbar title="Account admin" buttons={buttons} />
      <ManagePasswordContents />
      <CreateNewUser />
      <ReactTabulator
        columns={props.userColumns}
        data={props.users}
        options={usersTableOptions}
      />
    </div>
  )
}

/** Require an array of Stuff documents in the props. */
ListUsers.propTypes = {
  users: PropTypes.array.isRequired,
  userColumns: PropTypes.array.isRequired,
  deleteUsers: PropTypes.func,
  setPassword: PropTypes.func,
  sendResetPasswordEmail: PropTypes.func,
}

export default ListUsers
