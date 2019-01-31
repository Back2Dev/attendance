import React from 'react'
import '../../lib/pinpayment_button'
import { Button } from 'semantic-ui-react'

const Payment = () => {
  return (
    <a className="pin-payment-button" href="https://pay.pinpayments.com/qrgb" id="add_member">
      <Button color="red" content="Pay Now" icon="credit card" />
    </a>
  )
}

{
  /* <img src='/images/pay-button.png' alt="Pay Now" width="86" height="38" /> */
}

export default Payment
