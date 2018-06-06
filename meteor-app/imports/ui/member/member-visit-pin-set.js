import React from 'react'
import PropTypes from 'prop-types';
import { Form, Label, Button, Header, Input } from 'semantic-ui-react'
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

  onPinInput = (e, props) => {
    this.setState({ [props['data-input']]: e.target.value })
    if (props['data-input'] == 'pin1' && e.target.value.length >= 4) {
      this.pin2.current.focus()
    }
  }

  componentDidMount() {
    this.pin1.current.focus()
  }

  componentDidUpdate() {
    if (this.state.pin2.length >= 4 && (this.state.pin1 == this.state.pin2)) {
      this.props.onSubmitPin(this.state.pin1)
    }
  }

  render() {
    const pinsDontMatch = this.state.pin2.length >= 4 && (this.state.pin1 != this.state.pin2)
    const inputSettings = {
      maxLength: '4',
      type: "tel",
      pattern: "/[0-9]/",
      inputMode: "numeric",
      style: { width: '100%', margin: '10px 0' },
    }
    return (
      <div className='member-visit-pin'>
        <div>
          Looks like you havnt set your own PIN.
        Please set one now.
          </div>
        <Form.Field>
          <Input
            placeholder='Enter your PIN'
            ref={this.pin1}
            data-input={'pin1'}
            {...inputSettings}
            onChange={this.onPinInput}
          />
          <Input
            placeholder='Confirm your PIN'
            ref={this.pin2}
            data-input={'pin2'}
            error={pinsDontMatch}
            {...inputSettings}
            onChange={this.onPinInput}
          />
          {
            pinsDontMatch &&
            <Label basic color='red' pointing>
              Make sure both PINs match.
              </Label>
          }
        </Form.Field>

      </div>
    )
  }
}

MemberVisitPinSet.propTypes = {
  onSubmitPin: PropTypes.func.isRequired,
  memberHasOwnPin: PropTypes.bool.isRequired,
};

export default MemberVisitPinSet