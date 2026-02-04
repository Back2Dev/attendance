import React from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { CartContext } from './cart-data'
import CONSTANTS from '/imports/api/constants'

const debug = require('debug')('b2b:shop')

const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
const Address = (props) => {
  const { state, dispatch } = React.useContext(CartContext)
  const [a, setAddress] = React.useState(
    state.creditCard && Object.keys(state.creditCard).length
      ? state.creditCard
      : {
          email: state.email,
          memberId: state.memberId,
        }
  )
  const [e, setError] = React.useState([])

  debug(state, a)
  const gotoShop = (e) => {
    dispatch({ type: 'clear' }) // Clear the cart ??
    props.history.push('/shop')
  }

  const fieldChange = (event) => {
    const addr = Object.assign({}, a)
    // debug(`changed: ${event.target.name} => ${event.target.value}`)
    addr[event.target.name] = event.target.value
    setAddress(addr)
    setError([])
  }

  const submitAddress = (event) => {
    event.preventDefault()
    const required = 'email line1 city postcode state country'.split(
      /\s+/
    )
    const errs = []

    // If we are valid...
    if (
      required
        .map((field) => {
          const f = field === 'email' ? 'email' : `address_${field}`
          let isValid = a[f] && a[f] !== ''
          if (isValid && field === 'email')
            isValid = emailRegex.test(a.email)
          if (!isValid) errs.push(field)
          debug(`${f}: ${a[f]} ${isValid}`)
          return isValid
        })
        .every((f) => f)
    ) {
      // Add the address to the cart
      dispatch({ type: 'save-address', payload: a })
      props.history.push('/shop/credit-card')
    } else setError(errs)
  }
  if (state.status === CONSTANTS.CART_STATUS.COMPLETE) {
    debug('Cart is complete')
    return (
      <Container maxWidth="sm">
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">
            Payment form - your billing address
          </Typography>
          <Box
            component="img"
            src={state.settings.logo}
            alt={`${state.settings.org} logo`}
            sx={{ maxWidth: 200, my: 2 }}
          />
          <Typography variant="body1">Payment has been completed</Typography>
          <Button
            variant="contained"
            color="success"
            onClick={gotoShop}
            sx={{ mt: 3 }}
          >
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
          Payment form - your billing address
        </Typography>
        <Box
          component="img"
          src={state.settings.logo}
          alt={`${state.settings.org} logo`}
          sx={{ maxWidth: 200, my: 2 }}
        />
        <Box
          component="form"
          id="address_form"
          onSubmit={submitAddress}
          sx={{ textAlign: 'left', mt: 2 }}
        >
          <TextField
            fullWidth
            error={e.indexOf('email') !== -1}
            label="Email"
            placeholder="Email"
            defaultValue={a.email}
            onChange={fieldChange}
            name="email"
            margin="dense"
          />
          <TextField
            fullWidth
            error={e.indexOf('line1') !== -1}
            label="Address"
            placeholder="Billing Address"
            defaultValue={a.address_line1}
            onChange={fieldChange}
            name="address_line1"
            margin="dense"
          />
          <TextField
            fullWidth
            error={e.indexOf('line2') !== -1}
            label="Address (Continued)"
            placeholder="Address line 2"
            defaultValue={a.address_line2}
            onChange={fieldChange}
            name="address_line2"
            margin="dense"
          />
          <TextField
            fullWidth
            error={e.indexOf('city') !== -1}
            label="City or suburb"
            placeholder="City"
            defaultValue={a.address_city}
            onChange={fieldChange}
            name="address_city"
            margin="dense"
          />
          <TextField
            fullWidth
            error={e.indexOf('state') !== -1}
            label="State or Province"
            placeholder="State/Province"
            defaultValue={a.address_state}
            onChange={fieldChange}
            name="address_state"
            margin="dense"
          />
          <TextField
            fullWidth
            error={e.indexOf('postcode') !== -1}
            label="Postcode or ZIP"
            placeholder="Postcode/ZIP"
            defaultValue={a.address_postcode}
            onChange={fieldChange}
            name="address_postcode"
            margin="dense"
          />
          <TextField
            fullWidth
            error={e.indexOf('country') !== -1}
            label="Country"
            placeholder="Country"
            defaultValue={a.address_country}
            onChange={fieldChange}
            name="address_country"
            margin="dense"
          />

          {e.length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Oops, your billing address isn't quite right: {e.join(', ')}
            </Alert>
          )}
        </Box>
        <Button
          variant="contained"
          color="success"
          onClick={submitAddress}
          sx={{ mt: 3 }}
        >
          Next
        </Button>
        <Typography variant="body2" sx={{ mt: 1 }}>
          On the next page you will enter your credit card details
        </Typography>
      </Paper>
    </Container>
  )
}

export default Address
