import React from 'react'
import { Button, Header, Icon, Input, Modal } from 'semantic-ui-react'
import { SEND_SMS } from '/imports/api/constants'
const debug = require('debug')('b2b:sms')

const SmsModal = ({ job }) => {
  const cost = job.totalCost / 100
  const payUrl = Meteor.absoluteUrl(`/pay/${job.jobNo}`)
  const [isOpen, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState(
    `Your bike is ready for pickup. Cost is $${cost}. Please pay at ${payUrl}`
  )

  const updateMessage = (e) => {
    setMessage: e.target.value
  }

  const submit = () => {
    if (!message) {
      // todo: fix Alert.error so that it displays above modal
      alert('Please enter a message to send')
    } else {
      Meteor.call('assessment.update', job, SEND_SMS, message)
      Meteor.call('sendPINSms', message, job.phone)
      debug('sending pickup message via sms.', message)
      setOpen(false)
    }
  }

  return (
    <Modal
      open
      basic
      size="small"
      open={isOpen}
      trigger={
        <Button
          className="ui button"
          color={job.isRefurbish ? 'grey' : 'purple'}
          style={{
            textAlign: 'center',
            margin: '5px',
            borderRadius: '5px',
          }}
          onClick={() => setOpen(true)}
          disabled={!!job.isRefurbish}
        >
          <h1>
            <Icon name="talk" />
          </h1>
          Send SMS
        </Button>
      }
    >
      <Header icon="arrow right" content={`Send 'pickup' SMS to customer ${job.name} on number: ${job.phone}`} />
      <Modal.Content>
        <div>
          <p />
          <label style={{ paddingBottom: '5px' }}>Message to send</label>
          <div>
            <Input onChange={updateMessage} defaultValue={message} fluid />
          </div>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="red" inverted onClick={() => setOpen(!isOpen)}>
          <Icon name="remove" /> Cancel
        </Button>
        <Button color="green" inverted onClick={submit}>
          <Icon name="checkmark" />
          Send
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
export default SmsModal
