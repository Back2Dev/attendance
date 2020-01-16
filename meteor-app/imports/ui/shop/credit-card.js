import React from 'react'
import Alert from 'react-s-alert'
import HostedFields from './pin'
import { Link } from 'react-router-dom'
import { Form, Image, Container, Segment, Header, Button, Modal, Checkbox, Icon, Input } from 'semantic-ui-react'
import { CartContext } from './cart-data'
import Price from './price'
import CONSTANTS from '/imports/api/constants'

const debug = require('debug')('b2b:shop')

const { paymentsHomePage, paymentTest, paymentApiKey } = Meteor.settings.public

// Put this variable here, so that it's outside React's lifecycle - when we create the
// fields object, it contains a tokenize function, which disappears on a component refresh
let fields = {}

const ErrMsg = props => (
  <span style={{ fontSize: '9px', color: 'red' }} {...props}>
    {props.children}
  </span>
)
const StatusMsg = props => (
  <span style={{ fontSize: '9px', color: 'green' }} {...props}>
    {props.children}
  </span>
)

const Required = props => <span style={{ color: 'red', paddingRight: '20px' }}>*</span>

const CreditCard = props => {
  let status = 'entry'
  const { state, dispatch } = React.useContext(CartContext)
  const [fakeState, setFakeState] = React.useState({ mockName: '', mockNumber: '', mockCvc: '', mockExpiry: '' })
  const [errors, setErrors] = React.useState({})
  const [statusMsg, setStatus] = React.useState('')
  const [keep, setKeep] = React.useState(true)
  const memberId = props.match.params.id
  const codes = state.products
    .map(prod => {
      return prod.qty === 1 ? prod.code : `${prod.qty}x${prod.code}`
    })
    .join(',')

  const { _id: cartId, price } = state
  if (!cartId && !memberId) debug('cart._id or memberId is missing from state', state)
  const { email } = state.creditCard

  React.useEffect(props => {
    debug('useEffect', props)
    if (status === 'entry' && state.status !== CONSTANTS.CART_STATUS.COMPLETE) {
      status = 'loading'
      debug(`calling HostedFields ${status}`)
      if (!Meteor.settings.public.mockpinpayment) {
        fields = HostedFields.create({
          /* Set this to true when testing. Set it to false in production. */
          sandbox: paymentTest,

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
    }
  }, [])

  async function tokenizeCallback(response) {
    debug(`Calculated card token as ${response.token}`, response)
    state.creditCard = response

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
      debug('Customer created ok', result)
    }

    if (price === 0) {
      state.status = CONSTANTS.CART_STATUS.COMPLETE
      dispatch({ type: 'save-cart', payload: null })
      props.history.replace('/shop/registered')
    } else {
      debug('Making payment')
      setStatus('Transmitting')
      const result = await Meteor.callAsync('makePayment', packet)
      setStatus('')
      if (typeof result === 'string' && (result.match(/^Request failed/i) || result.match(/error/i))) {
        setErrors({ remote: result })
      } else {
        // The cart gets updated with the response on the server
        // So show the payment receipt now
        Alert.success('Payment completed')
        state.status = CONSTANTS.CART_STATUS.COMPLETE
        props.history.replace('/shop/receipt')
      }
    }
  }

  async function mockPinpayment(fakeState) {
    const response = { cardToken: 'card-abc123', customerToken: 'customer-abc123' }
    const packet = {
      amount: price.toString(),
      currency: 'AUD',
      description: 'Purchase',
      email,
      metadata: { cartId, codes }
    }

    debug(`Calculated card token as ${response.token}`, response)

    debug('Creating customer ', packet)
    let result = await Meteor.callAsync('createMockCustomer', packet, response.customerToken)
    debug('Customer created ok', result)

    debug('Making payment')
    setStatus('Transmitting')
    result = await Meteor.callAsync('mockMakePayment', packet, fakeState)
    setStatus('')
    state.creditCard = result.card
    if (typeof result === 'string' && (result.match(/^Request failed/i) || result.match(/error/i))) {
      setErrors({ remote: result })
    } else {
      // The cart gets updated with the response on the server
      // So show the payment receipt now
      Alert.success('Payment completed')
      state.status = CONSTANTS.CART_STATUS.COMPLETE
      props.history.replace('/shop/receipt')
    }
  }

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
        publishable_api_key: paymentApiKey
      },
      state.creditCard
    )
    console.log('tokenize')
    try {
      if (Meteor.settings.public.mockpinpayment) {
        debug('mocking response')
        mockPinpayment(fakeState)
      } else {
        fields.tokenize(address, async (err, response) => {
          if (err) {
            console.log('tokenize errors', err)
            handleErrors(err)
            return
          }
          tokenizeCallback(response)
        })
      }
    } catch (err) {
      debug(`Error $err.message`, err)
    }
  }

  /* Handles rendering of the error messages to the form. */

  function handleErrors(err) {
    /* Clear any existing error messages. */
    const errors = {}
    setStatus('')
    /* Add each error message to their respective divs. */
    debug('Handling errors', err)
    cardFormParams = 'name number cvc expiry'.split(/\s+/)
    if (err.messages) {
      errors.remote = ''
      err.messages.forEach(errMsg => {
        errors[errMsg.param] = errMsg.message
        if (!cardFormParams.includes(errMsg.param)) errors.remote = `${errors.remote} ${errMsg.message}`
      })
      debug('Errors:', errors)
      setErrors(errors)
    } else {
      if (err.error_description) {
        setErrors({ remote: err.error_description })
      }
    }
  }

  const submitForm = e => {
    console.log('测试', fakeState)
    debug('Tokenising fields')
    e.preventDefault()
    setErrors({})
    setStatus('Preparing')
    try {
      tokenizeHostedFields()
    } catch (err) {
      debug(`Error $err.message`, err)
    }
  }

  const setFake = (e, { id, value }) => {
    const newFake = { ...fakeState }
    Object.assign(newFake, { [id]: value })
    setFakeState(newFake)
  }

  const gotoShop = e => {
    dispatch({ type: 'clear' }) // Clear the cart ??
    props.history.push('/shop')
  }

  if (state.status === CONSTANTS.CART_STATUS.COMPLETE) {
    debug('Cart is complete')
    return (
      <Container text textAlign="center">
        <Segment textAlign="center">
          <Header as="h2">Payment form - credit card</Header>
          <Header as="h2">
            <Image src={state.settings.logo} />
          </Header>
          <div>Payment has been completed</div>
          <Button size="mini" type="button" color="green" onClick={gotoShop} style={{ marginTop: '24px' }}>
            Back to the shop
          </Button>
        </Segment>
      </Container>
    )
  }
  return (
    <Container text textAlign="center">
      <Segment textAlign="center">
        <Header as="h2">
          Payment form - credit card <span style={{ color: 'white' }}>{cartId}</span>
        </Header>
        <Header as="h2">
          <Image src={state.settings.logo} />
        </Header>
        <Header as="h5">
          Cards accepted: &nbsp;&nbsp;
          <Image src="/images/cards.png" verticalAlign="middle" verticalAlign="middle" style={{ width: '200px' }} />
        </Header>
        <Form id="payment_form" method="post" style={{ textAlign: 'left' }}>
          <Header as="h2" style={{ textAlign: 'center' }}>
            {price > 0 && (
              <>
                Total charge for card: <Price cents={price} />
              </>
            )}
            {price === 0 && `No charge today, please provide your card details`}
          </Header>
          <label htmlFor="name">
            Full name <Required />
            <ErrMsg id="err.name">{errors.name}</ErrMsg>
          </label>
          <br />
          <div id="name" />
          {Meteor.settings.public.mockpinpayment && (
            <div>
              <Input fluid id="mockName" placeholder="Fake name on card" onChange={setFake} />
            </div>
          )}

          <label htmlFor="number">
            Card number <Required />
            <ErrMsg id="err.number">{errors.number}</ErrMsg>
          </label>
          <br />
          <div id="number" />
          {Meteor.settings.public.mockpinpayment && (
            <div>
              <Input fluid id="mockNumber" placeholder="Fake credit card number" onChange={setFake} />
            </div>
          )}

          <label htmlFor="cvc">
            CVC <Required />
            <ErrMsg id="err.cvc">{errors.cvc}</ErrMsg>
          </label>
          <br />
          <div id="cvc" />
          {Meteor.settings.public.mockpinpayment && (
            <div>
              <Input fluid id="mockCvc" placeholder="Fake CVC on back of card" onChange={setFake} />
            </div>
          )}

          <label htmlFor="expiry">
            Expiry <Required />
            <ErrMsg id="err.expiry">{errors.expiry}</ErrMsg>
          </label>
          <br />
          <div id="expiry" />
          {Meteor.settings.public.mockpinpayment && (
            <div>
              <Input fluid id="mockExpiry" placeholder="Fake expriy date" onChange={setFake} />
            </div>
          )}
        </Form>
        <ErrMsg id="err.remote">{errors.remote}</ErrMsg>
        <StatusMsg id="status.msg">{statusMsg}</StatusMsg>
        <br />
        <Button size="mini" type="button" color="green" onClick={submitForm} style={{ marginTop: '24px' }}>
          {price === 0 ? 'Register card' : 'Pay'}
        </Button>
        {!memberId && price > 0 && (
          <>
            <Checkbox
              label="Keep my card on file for future payments"
              name="keep"
              id="keep"
              checked={keep}
              disabled={price === 0}
              value={1}
              onChange={e => setKeep(!keep)}
              style={{ marginTop: '12px', marginLeft: '12px' }}
            />
            <Modal
              trigger={
                <Button size="mini" type="button" inverted color="blue" icon style={{ marginLeft: '12px' }}>
                  <Icon name="info" />
                  Why?
                </Button>
              }
              closeIcon
            >
              <Modal.Content scrolling>
                <Modal.Description>
                  <a href={paymentsHomePage} target="_blank">
                    <Header as="h2">
                      <Image src={state.settings.logo} />
                      <Image src="/images/pinpayments.png" style={{ width: '140px' }} />
                    </Header>
                  </a>
                  <Header as="h3">Why should I save my card information?</Header>
                  <p>
                    We don't save your card details on our system. It is securely stored for your convenience on our
                    payment gateway using PCI DSS standards. Saving it will make it easier for you to buy from us next
                    time, without the need to re-enter all your details.
                  </p>
                  <p>You can remove your card from the system at any time.</p>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          </>
        )}
      </Segment>
    </Container>
  )
}

export default CreditCard
