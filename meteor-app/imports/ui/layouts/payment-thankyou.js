import React from 'react'
import './payment-thankyou.css'
import Nav from '/imports/ui/member/member-nav'

const PaymentThankyou = () => (
  <div className="payment-wrapper">
    <title>Back 2 Bikes | Thank You</title>
    <Nav />
    <div style={{ marginTop: '70px', height: '100%' }}>
      <h1>Thank you!</h1>
      <div className='green-tick-image'>
        <img src='/images/check-mark.png' alt="Thank you" />
      </div>
    </div>
  </div>
)

export default PaymentThankyou
