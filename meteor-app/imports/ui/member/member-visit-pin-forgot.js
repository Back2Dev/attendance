import React from 'react'
import PropTypes from 'prop-types';
import { Icon, Form, Label, Button, Header, Input, Message } from 'semantic-ui-react'
// import '/imports/ui/member/member-visit-pin.css'

class MemberVisitPinForgot extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      value: 'grey',
      selected: 'email',
      sent: false,
    }
  }

  onDeliverySelection = (e, { name }) => {
    this.setState({ selected: [name] })
  }

  componentDidMount() {
    // this.pin1.current.focus()
  }

  handleSubmit = (e, h) => {
    const { value } = this.state
    this.props.forgotPin(this.state.selected, this.state.value)
    this.props.onPinReminderSent()
  }

  onInput = (e, { value }) => {
    this.setState({
      value
    })
  }

  render() {
    const message = this.state.selected == 'email'
      ? 'email address'
      : 'mobile phone number'
    return (
      <div style={{ textAlign: 'center' }}>
        <h3>Select best way to send your PIN reminder:</h3>
        <Form
          ref={this.form}
          onSubmit={this.handleSubmit}>

          <Button.Group size='small'>
            <Button
              name={'email'}
              size='small'
              type='button'
              positive={this.state.selected == 'email'}
              onClick={this.onDeliverySelection}
            >
              Email
            </Button>
            <Button.Or />
            <Button
              name={'sms'}
              size='small'
              type='button'
              positive={this.state.selected == 'sms'}
              onClick={this.onDeliverySelection}
            >
              SMS
            </Button>
          </Button.Group>

          <Form.Field>

            <input
              hidden
              type='radio'
              checked={this.state.selected == 'email'}
              ref={this.email}
              name='email'
              onChange={this.onDeliverySelection}
            />
            <input
              hidden
              type='radio'
              checked={this.state.selected == 'sms'}
              ref={this.sms}
              name='sms'
              onChange={this.onDeliverySelection}
            />
            <Input
              ref={this.input}
              name={this.state.selected}
              onChange={this.onInput}
              placeholder={'Enter your ' + message}
            />
          </Form.Field>

          <Button
            type='submit'>
            Send
        </Button>
        </Form>
      </div >
    )

  }
}

MemberVisitPinForgot.propTypes = {
  onPinReminderSent: PropTypes.func.isRequired,
};

export default MemberVisitPinForgot