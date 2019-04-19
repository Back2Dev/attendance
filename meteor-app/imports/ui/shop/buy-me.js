import React from 'react'
import HostedFields from './pin'
import { Form } from 'semantic-ui-react'

const debug = require('debug')('b2b:shop')

const ErrMsg = React.forwardRef((props, ref) => (
  <span style={{ fontSize: '9px', color: 'red' }} {...props} ref={ref}>
    {props.children}
  </span>
))
const Required = props => <span style={{ color: 'red', paddingRight: '20px' }}>*</span>

const BuyMe = props => {
  let fields = {}
  const refs = {
    name: React.useRef(),
    cvc: React.useRef(),
    number: React.useRef(),
    expiry: React.useRef()
  }
  const [token, setToken] = React.useState('')
  const [errors, setErrors] = React.useState({})
  React.useEffect(props => {
    fields = HostedFields.create({
      /* Set this to true when testing. Set it to false in production. */
      sandbox: true,

      /*
        These are the CSS styles for the input elements inside the iframes. Inside each iframe
        is a single input with its id set to name, number, cvc or expiry.

        When the input has a valid value, it will have the 'hosted-fields-valid' class. When
        the input has an invalid value, it will have the 'hosted-fields-invalid' class.
      */
      styles: {
        input: {
          'font-size': '16px',
          'font-family': 'helvetica, tahoma, calibri, sans-serif',
          color: '#3a3a3a'
        },
        '.hosted-fields-invalid:not(:focus)': {
          color: 'red'
        }
      },

      /*
        The fields object defines the fields to be created. All four fields are required
        (name, number, cvc, expiry).

        Each field requires a selector for the element in which to create an iframe. Optionally,
        you can define placeholder text and a label selector (the CSS selector of the label
        element for that particular field).
      */
      fields: {
        name: {
          selector: '#name',
          placeholder: 'Name on card'
        },
        number: {
          selector: '#number',
          placeholder: 'Credit card number'
        },
        cvc: {
          selector: '#cvc',
          placeholder: 'CVC (on back of card)'
        },
        expiry: {
          selector: '#expiry',
          placeholder: 'Card Expiry (MM/DD)'
        }
      }
    })
  })

  /*
    Tokenises the hosted fields. Appends a hidden field for card_token on success, adds
    error messages otherwise.
  */

  function tokenizeHostedFields() {
    /*
    Tokenise the card. This requires address details not included in the hosted fields
    which can be pulled from elsewhere (such as other form elements).
  */
    fields.tokenize(
      {
        publishable_api_key: Meteor.settings.public.paymentApiKey,
        address_line1: '71 Carter St',
        address_line2: '',
        address_city: 'Middle Park',
        address_postcode: '3206',
        address_state: 'VIC',
        address_country: 'Australia'
      },
      (err, response) => {
        if (err) {
          handleErrors(err)
          return
        }

        /* Append a hidden element to the form with the card_token */
        debug(`Setting token to ${response.token}`)
        setToken(response.token)

        /* Resubmit the form with the added card_token input. */
        debug('Submitting')
        Meteor.call('makePayment', {
          // card_token: response.token,
          customer_token: 'cus_5yEM34e0ngYv_0yd-tDBYg',
          amount: '12000',
          currency: 'AUD',
          description: 'Advanced Testing',
          ip_address: '203.192.1.172',
          email: 'mikkelking@hotmail.com',
          metadata: { OrderNumber: '123456', CustomerName: 'Freddie Mercury' }
        })
        debug('Submitted ok')
      }
    )
  }

  /* Handles rendering of the error messages to the form. */

  function handleErrors(err) {
    /* Clear any existing error messages. */
    const errors = {}
    /* Add each error message to their respective divs. */

    err.messages.forEach(errMsg => {
      errors[errMsg.param] = errMsg.message
      if (refs[errMsg.param].current && refs[errMsg.param].current)
        refs[errMsg.param].current.innerHTML = errMsg.message
    })
    debug('Errors:', errors)
    // setErrors(errors)
  }

  const submitForm = e => {
    e.preventDefault()
    if (token === '') {
      debug('Tokenising fields')
      e.preventDefault()
      tokenizeHostedFields()
    }
  }
  return (
    <Form id="payment_form" action="/payment-confirm" method="post">
      <label htmlFor="name">
        Full name <Required />
        <ErrMsg id="ename" ref={refs.name}>
          {errors.name}
        </ErrMsg>
      </label>
      <br />
      <div id="name" />

      <label htmlFor="number">
        Card number <Required />
        <ErrMsg id="enumber" ref={refs.number}>
          {errors.number}
        </ErrMsg>
      </label>
      <br />
      <div id="number" />

      <label htmlFor="cvc">
        CVC <Required />
        <ErrMsg id="ecvc" ref={refs.cvc}>
          {errors.cvc}
        </ErrMsg>
      </label>
      <br />
      <div id="cvc" />

      <label htmlFor="expiry">
        Expiry <Required />
        <ErrMsg id="eexpiry" ref={refs.expiry}>
          {errors.expiry}
        </ErrMsg>
      </label>
      <br />
      <div id="expiry" />

      <input type="hidden" defaultValue={token} id="card_token" />
      <input type="submit" onClick={submitForm} id="form-submit" />
    </Form>
  )
}

export default BuyMe
