import React from 'react'
import HostedFields from './pin'
import { Link } from 'react-router-dom'
import { Form, Image, Container, Segment, Header, Button, Modal, Checkbox, Icon } from 'semantic-ui-react'
import { CartContext } from './cart-data'
import Price from './price'

const debug = require('debug')('b2b:shop')

// Put this variable here, so that it's outside React's lifecycle - when we create the
// fields object, it contains a tokenize function, which disappears on a component refresh
let fields = {}

const ErrMsg = props => (
  <span style={{ fontSize: '9px', color: 'red' }} {...props}>
    {props.children}
  </span>
)

const Required = props => <span style={{ color: 'red', paddingRight: '20px' }}>*</span>

const CreditCard = props => {
  let status = 'entry'
  const { state, dispatch } = React.useContext(CartContext)
  const [errors, setErrors] = React.useState({})
  const [keep, setKeep] = React.useState(false)
  const codes = state.products
    .map(prod => {
      return prod.qty === 1 ? prod.code : `${prod.qty}x${prod.code}`
    })
    .join(',')

  const { _id: cartId, price } = state
  const { email } = state.creditCard

  React.useEffect(props => {
    debug('useEffect', props)
    if (status === 'entry') {
      status = 'loading'
      debug(`calling HostedFields ${status}`)
      fields = HostedFields.create({
        /* Set this to true when testing. Set it to false in production. */
        sandbox: false,

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
  }, [])

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
        amount: price.toString(),
        currency: 'AUD',
        description: 'Purchase',
        email,
        metadata: { cartId, codes }
      }
      Object.keys(response).forEach(key => {
        packet[mapping[key] || key] = response[key]
      })
      if (keep) {
        debug('Creating customer ', packet)
        const result = await Meteor.callAsync('createCustomer', packet)
        debug('Submitted ok', result)
      }

      debug('Making payment')
      const result = await Meteor.callAsync('makePayment', packet)
      if (typeof result === 'string' && result.match(/^Request failed/i)) {
        props.history.push('/shop/failed')
      } else {
        // Save the result here, and show the payment receipt
        props.history.push('/shop/receipt')
      }
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
      })
      debug('Errors:', errors)
      setErrors(errors)
    } else {
      if (err.error_description) {
        // setStatus('error')
      }
    }
  }

  const submitForm = e => {
    debug('Tokenising fields')
    e.preventDefault()
    tokenizeHostedFields()
  }

  return (
    <Container text textAlign="center">
      <Segment textAlign="center">
        <Header as="h2">Payment form - credit card</Header>
        <Header as="h2">
          <Image src={state.logo} />
        </Header>
        <Header as="h5">
          Cards accepted: &nbsp;&nbsp;
          <Image src="/images/cards.png" verticalAlign="middle" verticalAlign="middle" style={{ width: '200px' }} />
        </Header>
        <Form id="payment_form" action="/payment-confirm" method="post" style={{ textAlign: 'left' }}>
          <Header as="h2" style={{ textAlign: 'center' }}>
            Total charge for card: <Price cents={price} />
          </Header>
          <label htmlFor="name">
            Full name <Required />
            <ErrMsg>{errors.name}</ErrMsg>
          </label>
          <br />
          <div id="name" />

          <label htmlFor="number">
            Card number <Required />
            <ErrMsg>{errors.number}</ErrMsg>
          </label>
          <br />
          <div id="number" />

          <label htmlFor="cvc">
            CVC <Required />
            <ErrMsg>{errors.cvc}</ErrMsg>
          </label>
          <br />
          <div id="cvc" />

          <label htmlFor="expiry">
            Expiry <Required />
            <ErrMsg>{errors.expiry}</ErrMsg>
          </label>
          <br />
          <div id="expiry" />
        </Form>
        <Button size="mini" type="button" color="green" onClick={submitForm} style={{ marginTop: '24px' }}>
          Pay
        </Button>
        <Checkbox
          label="Keep my card on file for future payments"
          name="keep"
          id="keep"
          onChange={e => setKeep(!keep)}
          style={{ marginTop: '12px', marginLeft: '12px' }}
        />{' '}
        <Modal
          trigger={
            <Button size="mini" type="button" inverted color="blue" icon>
              <Icon name="info" />
              Why?
            </Button>
          }
          closeIcon
        >
          <Modal.Content scrolling>
            <Modal.Description>
              <a href="https://pinpayments.com" target="_blank">
                <Header as="h2">
                  <Image src={state.logo} />
                  <Image src="/images/pinpayments.png" style={{ width: '140px' }} />
                </Header>
              </a>
              <Header as="h3">Why should I save my card information?</Header>
              <p>
                We don't save your card details on our system. It is securely stored for your convenience on our payment
                gateway using PCI DSS standards. Saving it will make it easier for you to buy from us next time, without
                the need to re-enter all your details.
              </p>
              <p>You can remove your card from the system at any time.</p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </Segment>
    </Container>
  )
}

export default CreditCard
