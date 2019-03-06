import React, { Component } from 'react'
import { Text, View, Button, StyleSheet } from 'react-native'
// import stripe from 'tipsi-stripe'


stripe.setOptions({
  publishableKey: 'pk_test_315Jrr5E4VK9O1motqWvTJS9',
})

export default class StripeSubscription extends Component {
  // requestPayment = () => {
  //   return stripe 
  //   .paymentRequestWithCardForm()
  //   .then(stripeTokenInfo => {
  //     console.warn('Token created', {stripeTokenInfo})
    
  //   })
  //   .catch(error => {
  //     console.warn('Payment failed', {error })
  //   })
  // }

  // componentDidMount = () => {
  //   const options = {
  //     smsAutofillDisabled: true,
  //     requiredBillingAddressFields: 'zip',
  //   }

  //   stripe.paymentRequestWithCardForm(options)
  //   .then(response => {
  //     //get the token from the response,a nd send to your server 
  //   })
  //   .catch(error => {
  //     //handle error
  //   })
  // }
  


  render() {
    return (
      // <View style={StyleSheet.container}>
      <View>
        {/* <Button 
        title="Make a payment"
        onPress={this.requestPayment}
        disable={this.UNSAFE_componentWillMount.state.isPaymentPending}
        /> */}
        <Text> StripeSubscription area</Text>
{/* 
            { this.state.selectedOption === "monthlyFrequency" && <Text>You have a monthly subscription</Text>}
            { this.state.selectedOption === "quarterlyFrequency" && <Text>You have a quarterly subscription</Text>}
            { this.state.selectedOption === "sixMonthFrequency" && <Text>You have a six month subscription</Text>}
            
            { this.state.selectedOption === "no-subscription" && <p></p>}

            { this.state.selectedOption === "no-subscription" && 
            <> */}
              <Text>You do not currently have a subscription</Text>
              <Text>Would you like to buy a subscription</Text>

                <Button 
                  title="Monthly Subscription"
                  // onPress={this.addMonthlySubscription}
                />

                <Button 
                  title="3 Month Subscription"
                  // onPress={this.addMonthlySubscription}
                />

                <Button 
                  title="6 Month Subscription"
                  // onPress={this.addMonthlySubscription}
                />




              {/* <Button onPress={this.addQuarterlySubscription}>Quarterly Subscription</Button> */}
             
             
             
              {/* <Button>Monthly Subscription</Button>
              <Button>Three Month Subscription</Button>
              <Button>Six Month Subscription</Button> */}
            {/* </>} */}

      </View>
    )
  }
}
