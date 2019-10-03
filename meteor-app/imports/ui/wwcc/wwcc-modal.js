import React, { Component } from 'react'
import { Button, Header, Icon, Input, Modal } from 'semantic-ui-react'
import Alert from 'react-s-alert'

const debug = require('debug')('b2b:sms')

class WwccModal extends Component {
  state = {
    wwcc: ``,
    isOpen: false
  }

  updateWwcc = e => {
    this.setState({
      wwcc: e.target.value
    })
  }

  submit = () => {
    if (!this.state.wwcc) {
      // todo: fix Alert.error so that it displays above modal
      alert('Please enter a wwcc to check')
    } else {
      this.props.checkWwcc(this.props.member._id, this.state.wwcc, this.props.member.name)
      this.setState({ isOpen: false })
    }
  }

  render(props) {
    const { job } = this.props
    return (
      <Modal
        open
        basic
        size="small"
        open={this.state.isOpen}
        trigger={
          <Button
            className="ui button"
            color="blue"
            inverted
            style={{
              textAlign: 'center',
              margin: '5px',
              borderRadius: '5px'
            }}
            onClick={() => this.setState({ isOpen: true })}
          >
            Add...
          </Button>
        }
      >
        <Header icon="arrow right" content={`Add Wwcc no`} />
        <Modal.Content>
          <div>
            <p />
            <label style={{ paddingBottom: '5px' }}>Wwcc No (8 digits)</label>
            <div>
              <Input onChange={this.updateWwcc} defaultValue={this.state.wwcc} fluid />
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={() => this.setState({ isOpen: false })}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button color="green" inverted onClick={this.submit}>
            <Icon name="checkmark" />
            Check
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
export default WwccModal
