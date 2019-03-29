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

/**
  |--------------------------------------------------
  | The above is working and returning an object to us (viewable in console)
    In order to then charge the customer we need to send 
    this token to our backend in order to charge the customer.
    I have provided an example below using axios

  |--------------------------------------------------
  */
//Within the onToken method above:

// const data = { token, email }
// const url =  `${process.env.REACT_APP_DOMAIN}/<INSERT ENDPOINT HERE>`
//
// axios.post(url, data)
//   .then( response => {
//     const { success } = response.data
//     this.setState({
//       success
//     })
//     // console.log(this.props)
//     this.props.setPayment()
//   })
//   .catch ( err => {
//     console.log(err.response)
//   })
//the endpoint needs to be added to the backend

/**
|--------------------------------------------------
| Within the backend - if we were using express router instead of meteor:
|--------------------------------------------------
*/
// var stripe = require("stripe")("<YOUR STRIPE SECRET KEY IN HERE");

// router.post('/api/stripe', (req, res, next) => {
// // Token is created using Checkout or Elements!
// // Get the payment token ID submitted by the form:
// const token = request.body.stripeToken; // Using Express

// (async () => {
//   const charge = await stripe.charges.create({
//     amount: 999,
//     currency: 'usd',
//     description: 'Example charge',
//     source: token,
//     statement_descriptor: 'Back 2 Bikes'
//   });
// })();

// User.findOne({email})
// .then( user => {
//     user.paymentCustId = customer.id;
//     user.paymentSource = customer.sources.data[0]
//     // console.log(`20 - payment.controller ${customer.sources.data[0].card.last4}`)
//     return user.save();
// })
// .catch( err =>
//     console.log(err))
