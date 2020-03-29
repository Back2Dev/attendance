import React, { Component } from 'react'
import { Button, Header, Icon, Input, Modal } from 'semantic-ui-react'
import Alert from '/imports/ui/utils/alert'
import { PHONE_CALL } from '/imports/api/constants'

class Element extends Component {
  state = {
    message: `Called customer...`,
    isOpen: false
  }

  updateMessage = e => {
    this.setState({
      message: e.target.value
    })
  }

  submit = () => {
    if (!this.state.message) {
      // todo: fix Alert.error so that it displays above modal
      alert('Please enter the gist of the phone call')
    } else {
      Meteor.call('assessment.update', this.props.job, PHONE_CALL, this.state.message)
      this.setState({ isOpen: false })
    }
  }

  render(props) {
    const { job } = this.props
    const disabled = !!job.customerDetails.isRefurbish
    const reason = job.customerDetails.isRefurbish
      ? 'This is a refurbish, there is no customer to call'
      : 'Call customer'
    return (
      <Modal
        open
        basic
        size="small"
        open={this.state.isOpen}
        trigger={
          <Button
            className="ui button"
            color={job.customerDetails.isRefurbish ? 'grey' : 'pink'}
            style={{ textAlign: 'center', margin: '5px', borderRadius: '5px' }}
            onClick={() => this.setState({ isOpen: true })}
            disabled={disabled}
            title={reason}
          >
            <h1>
              <Icon name="phone" />
            </h1>
            Call Customer
          </Button>
        }
      >
        <Header
          icon="arrow right"
          content={`Call customer ${job.customerDetails.name} on number: ${job.customerDetails.phone}`}
        />
        <Modal.Content>
          <div>
            <p />
            <label style={{ paddingBottom: '5px' }}>Gist of conversation</label>
            <div>
              <Input onChange={this.updateMessage} defaultValue={this.state.message} fluid />
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" inverted onClick={() => this.setState({ isOpen: false })}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button color="green" inverted onClick={this.submit}>
            <Icon name="checkmark" />
            Send
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
export default Element
