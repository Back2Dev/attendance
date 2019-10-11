import React from 'react'
import { Container, Header, Accordion, Label, Image, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import CreditCardButton from '/imports/ui/member/member-payment'

const payments = [
  {
    content: (
      <Message
        key="1"
        header="Credit Card payment (via Pin Payments, click button to pay)"
        content={<CreditCardButton url={Meteor.settings.public.paymentSite}></CreditCardButton>}
      />
    )
  },
  {
    content: (
      <Message
        header="Direct Bank Transfer"
        key="2"
        content={
          <div>
            Commonwealth Bank,
            <br />
            BSB: 063 000 <br />
            A/C: 1221 4326
          </div>
        }
      />
    )
  },
  {
    content: (
      <Message
        key="3"
        header="Pay Pal.me"
        content={
          <a href="https://paypal.me/back2bikes?locale.x=en_AU" target="_blank">
            Paypal.me/back2bikes
          </a>
        }
      />
    )
  },
  {
    content: <Message key="4" header="Pay Pal send money" content="Send to admin@back2bikes.com.au" />
  }
]

const PaymentPage = props => {
  return (
    <Container>
      <Header as="h2" textAlign="center">
        Payment options
      </Header>
      <div>
        <Image src="/images/paypal-here.png"></Image>
      </div>
      <p>
        Normally we process payments using the PayPal Here device. You should enter the details of the sale on the iPad,
        and then tap the card reader to complete the payment.
      </p>
      <p>if the card reader is not working, we have the following payment options </p>
      {payments.map(payment => payment.content)}
    </Container>
  )
}

PaymentPage.propTypes = {}

export default PaymentPage
