import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Header, Icon, Input, Modal } from 'semantic-ui-react'

const debug = require('debug')('b2b:super-admin')

class AddUserModal extends Component {
  state = {
    username: '',
    email: ``,
    password: '',
    isOpen: false,
  }

  updateUsername = (e) => {
    this.setState({
      username: e.target.value,
    })
  }

  updateEmail = (e) => {
    this.setState({
      email: e.target.value,
    })
  }

  updatePassword = (e) => {
    this.setState({
      password: e.target.value,
    })
  }

  submit = () => {
    if (!(this.state.email && this.state.password)) {
      // todo: fix Alert.error so that it displays above modal
      alert('Both email and password are required')
    } else {
      this.props.addNewUser(
        this.state.username,
        this.state.email,
        this.state.password
      )
      this.setState({ isOpen: false })
    }
  }

  render(props) {
    return (
      <Modal
        open
        basic
        size="small"
        open={this.state.isOpen}
        trigger={
          <Button
            size="mini"
            color="black"
            type="button"
            onClick={() => this.setState({ isOpen: true })}
          >
            Add...
          </Button>
        }
      >
        <Header icon="arrow right" content={`Add user`} />
        <Modal.Content>
          <div>
            <p />
            <label style={{ paddingBottom: '5px' }}>Username</label>
            <div>
              <Input
                onChange={this.updateUsername}
                fluid
                id="username"
              />
            </div>
            <p />
            <label style={{ paddingBottom: '5px' }}>Email</label>
            <div>
              <Input onChange={this.updateEmail} fluid id="email" />
            </div>
            <p />
            <label style={{ paddingBottom: '5px' }}>Password</label>
            <div>
              <Input
                onChange={this.updatePassword}
                fluid
                id="password"
              />
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            basic
            color="red"
            inverted
            onClick={() => this.setState({ isOpen: false })}
            id="cancel"
          >
            <Icon name="remove" /> Cancel
          </Button>
          <Button
            color="green"
            inverted
            onClick={this.submit}
            id="check"
          >
            <Icon name="checkmark" />
            Create
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
export default AddUserModal

AddUserModal.propTypes = {
  addNewUser: PropTypes.func.isRequired,
}
