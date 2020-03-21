import React from 'react'
import './payment-thankyou.css'

const PaymentThankyou = ({ match, location }) => {
  const result = Meteor.callAsync('service.paid', match.params.jobNo, location.search)
  return (
    <div className="payment-wrapper">
      <title>Back 2 Bikes | Thank You</title>
      <div style={{ marginTop: '70px', height: '100%' }}>
        <h1>Thank you!</h1>
        <div className="green-tick-image">
          <img src="/images/check-mark.png" alt="Thank you" />
        </div>
      </div>
    </div>
  )
}

export default PaymentThankyou
