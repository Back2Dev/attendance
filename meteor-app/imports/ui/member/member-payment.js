import React from 'react'
import '../../lib/pinpayment_button'
import { Button } from 'semantic-ui-react'

const Payment = () => {
  return (
    <a className="pin-payment-button" href="https://pay.pinpayments.com/qrgb/test?success_url=http%3A%2F%2Flocalhost%3A3000%2Fpayment">
    <Button 
    color='red'
    content='Pay Now'
    icon='credit card outline'
    />
    </a>
  )
}

{/* <img src='/images/pay-button.png' alt="Pay Now" width="86" height="38" /> */}

export default Payment
