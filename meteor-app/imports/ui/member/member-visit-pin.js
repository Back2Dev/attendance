import React from 'react'
import PropTypes from 'prop-types';
import { Form, Label, Button, Header, Input, Message } from 'semantic-ui-react'
import '/imports/ui/member/member-visit-pin.css'

class MemberVisitPin extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      pin: '',
      pinMatchError: false,
    }

    this.pinInput = React.createRef();
  }

  onPinInput = (e, props) => {
    this.setState({ pin: e.target.value })
  }

  componentDidMount() {
    if (this.pinInput && this.pinInput.current) {
      this.pinInput.current.focus()
    }
  }

  componentDidUpdate() {
    const { pin } = this.state
    if (pin.length >= 4) {
      this.props.onSubmitPin(pin)
    }
  }

  render() {
    const inputSettings = {
      maxLength: '4',
      type: "tel",
      pattern: "/[0-9]/",
      inputMode: "numeric",
      style: { 
        width: '80%', 
        margin: '10px 0', 
        fontSize: '20px', 
        textAlign: 'center' 
      },
    }
    return (
      <div className='member-visit-pin'>
        {
          this.props.setPinSuccess &&
          <Message attached='top' success
            header='Success'
            content='Sign in with your new PIN now!'
          >
          </Message>
        }
        <Form.Field>
          {
            !this.props.setPinSuccess &&
            <label htmlFor='pinInput'>
              Enter your PIN:
          </label>
          }
          <Input
            error={this.state.pin.length >= 4 && !this.props.validPin}
            ref={this.pinInput}
            name='pinInput'
            {...inputSettings}  
            onChange={this.onPinInput}
          />
          <Button as={Label} pointing onClick={this.props.toggleForgotPinForm}>
            Forgotten your PIN? Click here
          </Button>
        </Form.Field>

      </div>
    )
  }
}

MemberVisitPin.propTypes = {
  forgotPin: PropTypes.func.isRequired,
  validPin: PropTypes.bool.isRequired,
  onSubmitPin: PropTypes.func.isRequired,
  toggleForgotPinForm: PropTypes.func.isRequired,
};

export default MemberVisitPin