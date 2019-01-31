import React, { Component } from 'react'
import { Button, Header, Icon, Input, Modal } from 'semantic-ui-react'
import Alert from 'react-s-alert'
import { SEND_SMS } from '/imports/api/constants'

class SmsModal extends Component {
  state = {
    message: `Your bike is ready for pickup. Cost is $${this.props.job.totalCost / 100}`,
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
      alert('Please enter a message to send')
    } else {
      Meteor.call('assessment.update', this.props.job, SEND_SMS, this.state.message)
      Meteor.call('sendPINSms', this.state.message, this.props.job.customerDetails.phone)
      debug('sending pickup message via sms.', this.state.message)
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
            color={job.customerDetails.isRefurbish ? 'grey' : 'purple'}
            style={{
              textAlign: 'center',
              margin: '5px',
              borderRadius: '5px'
            }}
            onClick={() => this.setState({ isOpen: true })}
            disabled={!!job.customerDetails.isRefurbish}
          >
            <h1>
              <Icon name="envelope outline" />
            </h1>
          </Button>
        }
      >
        <Header
          icon="arrow right"
          content={`Send 'pickup' SMS to customer ${job.customerDetails.name} on number: ${job.customerDetails.phone}`}
        />
        <Modal.Content>
          <div>
            <p />
            <label style={{ paddingBottom: '5px' }}>Message to send</label>
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
export default SmsModal
