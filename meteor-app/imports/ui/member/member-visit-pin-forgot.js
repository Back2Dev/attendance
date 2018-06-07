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

          <div>
            <Button
              icon
              name={'email'}
              type='button'
              color={this.state.selected == 'email' ? 'green' : 'grey'}
              labelPosition='left'
              onClick={this.onDeliverySelection}
            >
              <Icon 
              name={this.state.selected == 'email' ? 'check' : 'mail' }
              />
              Email
</Button>
          </div>
          <div>
            <Button
              disabled
              name={'sms'}
              icon
              type='button'
              color={this.state.selected == 'sms' ? 'green' : 'grey'}
              labelPosition='left'
              onClick={this.onDeliverySelection}
            >
              <Icon 
              name={this.state.selected == 'sms' ? 'check' : 'mobile alternate' }
              />
              SMS
            </Button>
          </div>

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