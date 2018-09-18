import React from 'react'
import '../../lib/pinpayments.js'
import { Button, Form } from 'semantic-ui-react'
import './payment.css'

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
    const target = event.target;
    const value = target.value;
    const name = target.name;
    
    this.setState({[event.target.name]: event.target.value})
    
    this.setState({
      [name]: value
    });
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
            </label>
            <input type="text" value={this.state.value} onChange={this.handleChange} />
            <div id="name"></div>
            <div id="errors_for_name" className="error_message"></div>
          </Form.Field>

          <Form.Field>
            <label>
              Card Number:
            </label>
            <input type="text" value={this.state.value} onChange={this.handleChange} />
            <div id="number"></div>
            <div id="errors_for_number" className="error_message"></div>
          </Form.Field>
          <Form.Field>
            <label>
              CVC:
            </label>
            <input type="text" value={this.state.value} onChange={this.handleChange} />
            <div id="cvc"></div>
            <div id="errors_for_cvc" className="error_message"></div>
          </Form.Field>
          <Form.Field>
            <label>
              Expiry:
            </label>
            <input type="text" value={this.state.value} onChange={this.handleChange} />
            <div id="expiry"></div>
            <div id="errors_for_expiry" className="error_message"></div>
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>

      </div>
    );
  }
}

export default Payment
