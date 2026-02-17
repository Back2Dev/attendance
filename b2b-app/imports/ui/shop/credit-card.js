import React from 'react'
import Alert from '/imports/ui/utils/alert'
import HostedFields from './pin'
import {
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { useParams } from 'react-router-dom'
import { CartContext } from './cart-data'
import Price from './price'
import CONSTANTS from '/imports/api/constants'
import useHistory from '/imports/ui/utils/history'

const debug = require('debug')('app:shop')

const { paymentsHomePage, paymentTest, paymentApiKey } = Meteor.settings.public

// Put this variable here, so that it's outside React's lifecycle - when we create the
// fields object, it contains a tokenize function, which disappears on a component refresh
let fields = {}

const ErrMsg = (props) => (
  <span style={{ fontSize: '9px', color: 'red' }} {...props}>
    {props.children}
  </span>
)
const StatusMsg = (props) => (
  <span style={{ fontSize: '9px', color: 'green' }} {...props}>
    {props.children}
  </span>
)

const Required = (props) => <span style={{ color: 'red', paddingRight: '20px' }}>*</span>

const CreditCard = (props) => {
  const history = useHistory()
  const { id: memberId } = useParams()
  let status = 'entry'
  const { state, dispatch } = React.useContext(CartContext)
  const [fakeState, setFakeState] = React.useState({
    mockName: '',
    mockNumber: '',
    mockCvc: '',
    mockExpiry: '',
  })
  const [errors, setErrors] = React.useState({})
  const [statusMsg, setStatus] = React.useState('')
  const [keep, setKeep] = React.useState(true)
  const [infoOpen, setInfoOpen] = React.useState(false)
  const codes = state.products
    .map((prod) => {
      return prod.qty === 1 ? prod.code : `${prod.qty}x${prod.code}`
    })
    .join(',')

  const { _id: cartId, price } = state
  if (!cartId && !memberId) debug('cart._id or memberId is missing from state', state)
  const { email } = state.creditCard

  React.useEffect((props) => {
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
              color: '#3a3a3a',
            },
            '.hosted-fields-invalid:not(:focus)': {
              color: 'red',
            },
          },

          fields: {
            name: {
              selector: '#name',
              placeholder: 'Name on card',
            },
            number: {
              selector: '#number',
              placeholder: 'Credit card number',
            },
            cvc: {
              selector: '#cvc',
              placeholder: 'CVC (on back of card)',
            },
            expiry: {
              selector: '#expiry',
              placeholder: 'Card Expiry (MM/DD)',
            },
          },
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
      metadata: { cartId, codes },
    }
    Object.keys(response).forEach((key) => {
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
      history.replace('/shop/registered')
    } else {
      debug('Making payment')
      setStatus('Transmitting')
      const result = await Meteor.callAsync('makePayment', packet)
      setStatus('')
      if (
        typeof result === 'string' &&
        (result.match(/^Request failed/i) || result.match(/error/i))
      ) {
        setErrors({ remote: result })
      } else {
        // The cart gets updated with the response on the server
        // So show the payment receipt now
        Alert.success('Payment completed')
        state.status = CONSTANTS.CART_STATUS.COMPLETE
        history.replace('/shop/receipt')
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
      metadata: { cartId, codes },
    }

    debug(`Calculated card token as ${response.token}`, response)

    debug('Creating customer ', packet)
    let result = await Meteor.callAsync(
      'createMockCustomer',
      packet,
      response.customerToken
    )
    debug('Customer created ok', result)

    debug('Making payment')
    setStatus('Transmitting')
    result = await Meteor.callAsync('mockMakePayment', packet, fakeState)
    setStatus('')
    state.creditCard = result.card
    if (
      typeof result === 'string' &&
      (result.match(/^Request failed/i) || result.match(/error/i))
    ) {
      setErrors({ remote: result })
    } else {
      // The cart gets updated with the response on the server
      // So show the payment receipt now
      Alert.success('Payment completed')
      state.status = CONSTANTS.CART_STATUS.COMPLETE
      history.replace('/shop/receipt')
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
        publishable_api_key: paymentApiKey,
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
      err.messages.forEach((errMsg) => {
        errors[errMsg.param] = errMsg.message
        if (!cardFormParams.includes(errMsg.param))
          errors.remote = `${errors.remote} ${errMsg.message}`
      })
      debug('Errors:', errors)
      setErrors(errors)
    } else {
      if (err.error_description) {
        setErrors({ remote: err.error_description })
      }
    }
  }

  const submitForm = (e) => {
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

  const gotoShop = (e) => {
    dispatch({ type: 'clear' }) // Clear the cart ??
    history.push('/shop')
  }

  if (state.status === CONSTANTS.CART_STATUS.COMPLETE) {
    debug('Cart is complete')
    return (
      <Container maxWidth="sm">
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">Payment form - credit card</Typography>
          <Box
            component="img"
            src={state.settings.logo}
            alt={`${state.settings.org} logo`}
            sx={{ maxWidth: 200, my: 2 }}
          />
          <Typography variant="body1">Payment has been completed</Typography>
          <Button variant="contained" color="success" onClick={gotoShop} sx={{ mt: 3 }}>
            Back to the shop
          </Button>
        </Paper>
      </Container>
    )
  }
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5">
          Payment form - credit card <span style={{ color: 'white' }}>{cartId}</span>
        </Typography>
        <Box
          component="img"
          src={state.settings.logo}
          alt={`${state.settings.org} logo`}
          sx={{ maxWidth: 200, my: 2 }}
        />
        <Typography variant="subtitle1">
          Cards accepted:
          <Box
            component="img"
            src="/images/cards.png"
            alt="Accepted cards"
            sx={{ width: 200, ml: 1, verticalAlign: 'middle' }}
          />
        </Typography>
        <Box
          component="form"
          id="payment_form"
          method="post"
          sx={{ textAlign: 'left', mt: 2 }}
        >
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            {price > 0 && (
              <>
                Total charge for card: <Price cents={price} />
              </>
            )}
            {price === 0 && `No charge today, please provide your card details`}
          </Typography>
          <label htmlFor="name">
            Full name <Required />
            <ErrMsg id="err.name">{errors.name}</ErrMsg>
          </label>
          <br />
          <div id="name" />
          {Meteor.settings.public.mockpinpayment && (
            <div>
              <TextField
                fullWidth
                id="mockName"
                placeholder="Fake name on card"
                onChange={setFake}
                margin="dense"
              />
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
              <TextField
                fullWidth
                id="mockNumber"
                placeholder="Fake credit card number"
                onChange={setFake}
                margin="dense"
              />
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
              <TextField
                fullWidth
                id="mockCvc"
                placeholder="Fake CVC on back of card"
                onChange={setFake}
                margin="dense"
              />
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
              <TextField
                fullWidth
                id="mockExpiry"
                placeholder="Fake expriy date"
                onChange={setFake}
                margin="dense"
              />
            </div>
          )}
        </Box>
        <ErrMsg id="err.remote">{errors.remote}</ErrMsg>
        <StatusMsg id="status.msg">{statusMsg}</StatusMsg>
        <br />
        <Button variant="contained" color="success" onClick={submitForm} sx={{ mt: 3 }}>
          {price === 0 ? 'Register card' : 'Pay'}
        </Button>
        {!memberId && price > 0 && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  name="keep"
                  id="keep"
                  checked={keep}
                  disabled={price === 0}
                  value={1}
                  onChange={() => setKeep(!keep)}
                />
              }
              label="Keep my card on file for future payments"
              sx={{ mt: 2 }}
            />
            <Button
              type="button"
              variant="outlined"
              startIcon={<InfoIcon />}
              onClick={() => setInfoOpen(true)}
              sx={{ ml: 2, mt: 2 }}
            >
              Why?
            </Button>
            <Dialog
              open={infoOpen}
              onClose={() => setInfoOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Why should I save my card information?</DialogTitle>
              <DialogContent dividers>
                <a href={paymentsHomePage} target="_blank" rel="noreferrer">
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                    <Box
                      component="img"
                      src={state.settings.logo}
                      alt="Logo"
                      sx={{ height: 40 }}
                    />
                    <Box
                      component="img"
                      src="/images/pinpayments.png"
                      alt="PinPayments"
                      sx={{ height: 40 }}
                    />
                  </Box>
                </a>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  We don't save your card details on our system. It is securely stored for
                  your convenience on our payment gateway using PCI DSS standards. Saving
                  it will make it easier for you to buy from us next time, without the
                  need to re-enter all your details.
                </Typography>
                <Typography variant="body1">
                  You can remove your card from the system at any time.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setInfoOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Paper>
    </Container>
  )
}

export default CreditCard
