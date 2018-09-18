import React from 'react'
import '../../lib/pinpayments.js'
import { Button, Checkbox, Form } from 'semantic-ui-react'

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      cardNumber: 0,
      cvc: 0,
      expiry: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div className="payment-wrapper">
        <title>Back 2 Bikes | Payment</title>
        <h1>Welcome to B2B Payment!</h1>
        
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>
              Full Name:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
          </Form.Field>

          <Form.Field>
            <label>
              Card Number:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
          </Form.Field>
          <Form.Field>
            <label>
              CVC:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
          </Form.Field>
          <Form.Field>
            <label>
              Expiry:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>

      </div>
    );
  }
}

export default Payment
