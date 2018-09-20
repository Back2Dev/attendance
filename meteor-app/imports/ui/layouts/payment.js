import React from 'react'
import '../../lib/pinpayments.js'
import { Button, Form } from 'semantic-ui-react'
import './payment.css'

//NOTE: This is the test secret key do not publish
const apiKey = 'WiqQbXG1P_pDwdnnDSpnGA'

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      cardNumber: '',
      cvc: '',
      expiry: '',
      addressLine1: '',
      addressLine2: '',
      addressCity: '',
      addressPostcode: '',
      addressState: '',
      addressCountry: ''
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    
    this.setState({[event.target.name]: event.target.value})
    
    this.setState({
      [name]: value
    });
  }

  onSubmit(event) {
    event.preventDefault();
    const user = {
      fullName: this.state.fullName,
      cardNumber: this.state.cardNumber,
      cvc: this.state.cvc,
      expiry: this.state.expiry,
      addressLine1: this.state.addressLine1,
      addressLine2: this.state.addressLine2,
      addressCity: this.state.addressCity,
      addressPostcode: this.state.addressPostcode,
      addressState: this.state.addressState,
      addressCountry: this.state.addressCountry
    }

    console.log(user)

    postData(`https://test-api.pinpayments.com/1/charges`, {})
    .then(response => {
      response.json()
      console.log(response)
    })
    .catch(error => console.error(error))

    function postData(url = `https://test-api.pinpayments.com/1/charges`, data = {}) {
      return fetch(url, {
          method: "POST",
          mode: "cors",
          headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Authorization": apiKey
          },
          body: JSON.stringify(data),
      })
    }
  }

  // tokenizeHostedFields() {
  //   fields.tokenize(
  //     {
  //       publishable_api_key: {apiKey},
  //       address_line1: this.state.addressLine1,
  //       address_line2: this.state.addressLine2,
  //       address_city: this.state.addressCity,
  //       address_postcode: this.state.addressPostcode,
  //       address_state: this.state.addressState,
  //       address_country: this.state.addressCountry
  //     }
  // )};

  render() {
    return (
      <div className="payment-wrapper">
        <title>Back 2 Bikes | Payment</title>
        <h1>Welcome to B2B Payment!</h1>
        
        <Form onSubmit={this.onSubmit}>
        <Form.Field>
            <label>
              Address Line 1:
            </label>
            <input type="text" name="addressLine1" value={this.state.value} onChange={this.onChange} />
            <div id="address-line-1"></div>
            <div id="errors-for-address-line-1" className="error-message"></div>
          </Form.Field>
          <Form.Field>
            <label>
              Address Line 2:
            </label>
            <input type="text" name="addressLine2" value={this.state.value} onChange={this.onChange} />
            <div id="address-line-2"></div>
            <div id="errors-for-address-line-2" className="error-message"></div>
          </Form.Field>
          <Form.Field>
            <label>
              City:
            </label>
            <input type="text" name="addressCity" value={this.state.value} onChange={this.onChange} />
            <div id="address-city"></div>
            <div id="errors-for-address-city" className="error-message"></div>
          </Form.Field>
          <Form.Field>
            <label>
              Postcode:
            </label>
            <input type="text" name="addressPostcode" value={this.state.value} onChange={this.onChange} />
            <div id="address-postcode"></div>
            <div id="errors-for-address-postcode" className="error-message"></div>
          </Form.Field>
          <Form.Field>
            <label>
              State:
            </label>
            <input type="text" name="addressState" value={this.state.value} onChange={this.onChange} />
            <div id="address-state"></div>
            <div id="errors-for-address-state" className="error-message"></div>
          </Form.Field>
          <Form.Field>
            <label>
              Country:
            </label>
            <input type="text" name="addressCountry" value={this.state.value} onChange={this.onChange} />
            <div id="address-country"></div>
            <div id="errors-for-address-country" className="error-message"></div>
          </Form.Field>
          <Form.Field>
            <label>
              Full Name:
            </label>
            <input type="text" name="fullName" value={this.state.value} onChange={this.onChange} />
            <div id="name" selector='#name'></div>
            <div id="errors-for-name" className="error-message"></div>
          </Form.Field>
          <Form.Field>
            <label>
              Card Number:
            </label>
            <input type="text" name="cardNumber" value={this.state.value} onChange={this.onChange} />
            <div id="number" selector='#number'></div>
            <div id="errors_for_number" className="error_message"></div>
          </Form.Field>
          <Form.Field>
            <label>
              CVC:
            </label>
            <input type="text" name="cvc" value={this.state.value} onChange={this.onChange} />
            <div id="cvc" selector='#cvc'></div>
            <div id="errors_for_cvc" className="error_message"></div>
          </Form.Field>
          <Form.Field>
            <label>
              Expiry:
            </label>
            <input type="text" name="expiry" value={this.state.value} onChange={this.onChange} />
            <div id="expiry" selector='#expiry'></div>
            <div id="errors_for_expiry" className="error_message"></div>
          </Form.Field>
          <Form.Field>
            <input type="hidden" name="card_token" value={{}/*Response.token*/} />
            <div id="card_token"></div>
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>

      </div>
    );
  }
}

export default Payment
