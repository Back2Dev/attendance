import React from 'react'
import PropTypes from 'prop-types';
import { Form, Label, Button, Header, Input, Message } from 'semantic-ui-react'
import '/imports/ui/member/member-visit-pin.css'

class MemberVisitPinSet extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      pin1: '',
      pin2: '',
      pinMatchError: false,
    }

    this.pin1 = React.createRef();
    this.pin2 = React.createRef();
  }

  onPinInput = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  componentDidMount() {
    if (this.pin1 && this.pin1.current) {
      this.pin1.current.focus()
    }
  }

  handleSetPin = (e, h) => {
    const { pin1, pin2 } = this.state
    if (pin2.length >= 4 && (pin1 == pin2)) {
      this.props.setPin(pin1)
    }
  }

  render() {
    const pinsDontMatch = this.state.pin2.length >= 4 && (this.state.pin1 != this.state.pin2)
    const inputSettings = {
      maxLength: '4',
      type: "tel",
      pattern: "[0-9]{4}",
      inputMode: "numeric",
      style: { width: '80%', margin: '10px 0', fontSize: '20px', textAlign: 'center' },
    }
    return (
      <div className='member-visit-pin'>
        <h3>Set your own PIN:</h3>
        <Form
          ref={this.form}
          onSubmit={this.handleSetPin}>

          <Form.Field>
            <label htmlFor='pin1'>
              Enter a 4 digit pin
          </label>
            <Input
              ref={this.pin1}
              name='pin1'
              {...inputSettings}
              onChange={this.onPinInput}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor='pin2'>
              Confirm Your Pin
          </label>
            <Input
              ref={this.pin2}
              name='pin2'
              error={pinsDontMatch}
              {...inputSettings}
              onChange={this.onPinInput}
            />
            {
              pinsDontMatch &&
              <Label color='red' pointing>
                Make sure both PINs match.
            </Label>
            }
          </Form.Field>
          <Button
            type='submit'
            disabled={this.state.pin2.length < 4 || (this.state.pin1 != this.state.pin2)}>
            Set Pin
        </Button>
        </Form>
      </div >
    )
  }
}

MemberVisitPinSet.propTypes = {
  setPin: PropTypes.func.isRequired,
};

export default MemberVisitPinSet