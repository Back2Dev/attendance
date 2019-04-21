import React from 'react'
import HostedFields from './pin'
import { Form } from 'semantic-ui-react'
import { CartContext } from './cart-data'

const debug = require('debug')('b2b:shop')

const ErrMsg = React.forwardRef((props, ref) => (
  <span style={{ fontSize: '9px', color: 'red' }} {...props} ref={ref}>
    {props.children}
  </span>
))
const Required = props => <span style={{ color: 'red', paddingRight: '20px' }}>*</span>

const CreditCard = props => {
  let fields = {}
  const refs = {
    name: React.useRef(),
    cvc: React.useRef(),
    number: React.useRef(),
    expiry: React.useRef()
  }
  const [status, setStatus] = React.useState('entry')
  const { state, dispatch } = React.useContext(CartContext)
  React.useEffect(props => {
    if (status === 'entry') {
      debug(`calling HostedFields ${status}`)
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
    }
  })

  /*
    Tokenises the hosted fields. Appends a hidden field for card_token on success, adds
    error messages otherwise.
  */

  function tokenizeHostedFields() {
    /*
    Tokenise the card. This requires address details not included in the hosted fields
  */
    const address = Object.assign(
      {
        publishable_api_key: Meteor.settings.public.paymentApiKey
      },
      state.creditCard
    )

    fields.tokenize(address, async (err, response) => {
      if (err) {
        handleErrors(err)
        return
      }

      debug(`Calculated card token as ${response.token}`, response)

      /* Submit the form with the added card_token input. */
      debug('Submitting')
      const mapping = { token: 'card_token' }
      const packet = {
        // Need to make this real
        //  customer_token: 'cus_5yEM34e0ngYv_0yd-tDBYg',
        amount: price.toString(),
        currency: 'AUD',
        description: 'Initial Testing',
        ip_address: '203.192.1.172',
        email: 'mikkel@almsford.org',
        metadata: { cartId, codes }
      }
      Object.keys(response).forEach(key => {
        packet[mapping[key] || key] = response[key]
      })
      debug('Sending ', packet)
      // const result = await Meteor.callAsync('makePayment', packet)
      const result = await Meteor.callAsync('createCustomer', packet)
      debug('Submitted ok', result)
      if (typeof result === 'string' && result.match(/^Request failed/i)) setStatus('error')
      else setStatus('success')
    })
  }

  /* Handles rendering of the error messages to the form. */

  function handleErrors(err) {
    /* Clear any existing error messages. */
    const errors = {}
    /* Add each error message to their respective divs. */
    debug(err)
    if (err.messages) {
      err.messages.forEach(errMsg => {
        errors[errMsg.param] = errMsg.message
        if (refs[errMsg.param].current && refs[errMsg.param].current)
          refs[errMsg.param].current.innerHTML = errMsg.message
      })
      debug('Errors:', errors)
    } else {
      if (err.error_description) {
        setStatus('error')
      }
    }
  }

  const submitForm = e => {
    debug('Tokenising fields')
    e.preventDefault()
    tokenizeHostedFields()
  }

  const codes = state.products
    .map(prod => {
      return prod.qty === 1 ? prod.code : `${prod.qty}x${prod.code}`
    })
    .join(',')

  const { _id: cardId, price } = state

  return (
    <Form id="payment_form" action="/payment-confirm" method="post">
      <div>
        Product codes: {codes}, Total price: {price}
      </div>
      <label htmlFor="name">
        Full name <Required />
        <ErrMsg id="ename" ref={refs.name} />
      </label>
      <br />
      <div id="name" />

      <label htmlFor="number">
        Card number <Required />
        <ErrMsg id="enumber" ref={refs.number} />
      </label>
      <br />
      <div id="number" />

      <label htmlFor="cvc">
        CVC <Required />
        <ErrMsg id="ecvc" ref={refs.cvc} />
      </label>
      <br />
      <div id="cvc" />

      <label htmlFor="expiry">
        Expiry <Required />
        <ErrMsg id="eexpiry" ref={refs.expiry} />
      </label>
      <br />
      <div id="expiry" />

      <input type="submit" onClick={submitForm} id="form-submit" />
    </Form>
  )
}

export default CreditCard
