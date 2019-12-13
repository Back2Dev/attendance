import React from 'react'
// import { Meteor } from 'meteor/meteor'
import StripeCheckout from 'react-stripe-checkout'

export default class Checkout extends React.Component {
  // state = {
  //   payment: false
  // }

  onToken = token => {
    console.log(token)
  }

  // Meteor.settings.public.paymentApiKey ||
  render() {
    const paymentApiKey = 'pk_test_315Jrr5E4VK9O1motqWvTJS9'
    return (
      <div>
        <StripeCheckout
          amount={this.props.amount}
          stripeKey={paymentApiKey}
          token={this.onToken}
          label="Pay Back2Bikes"
          currency="AUD"
          panelLabel={this.props.panelLabel}
          data-label="Proceed to Pay with Card"
        />
      </div>
    )
  }
}
