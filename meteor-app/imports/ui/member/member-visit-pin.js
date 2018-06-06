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

    this.pin1 = React.createRef();
  }

  onPinInput = (e, props) => {
    this.setState({ pin: e.target.value })
  }

  componentDidMount() {
    this.pin1.current.focus()
  }

  componentDidUpdate() {
    if (this.state.pin.length >= 4) {
      this.props.onSubmitPin(this.state.pin)
    }
  }

  render() {
    const inputSettings = {
      maxLength: '4',
      type: "tel",
      pattern: "/[0-9]/",
      inputMode: "numeric",
      style: { width: '100%', margin: '10px 0' },
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
        Enter your PIN:
        <Input
          placeholder='Enter your PIN'
          error={this.state.pin.length >= 4 && !this.props.validPin}
          ref={this.pin1}
          data-input={'pin1'}
          {...inputSettings}
          onChange={this.onPinInput}
        />
        {
          this.props.setPinSuccess &&
          <Button as={Label} pointing onClick={this.props.forgotPin}>
            Forgotten your PIN? Click here
          </Button>
        }
      </div>
    )
  }
}

MemberVisitPin.propTypes = {
  forgotPin: PropTypes.func.isRequired,
  onSubmitPin: PropTypes.func.isRequired,
  memberHasOwnPin: PropTypes.bool.isRequired,
  validPin: PropTypes.bool.isRequired,
  setPinSuccess: PropTypes.bool.isRequired,
};

export default MemberVisitPin