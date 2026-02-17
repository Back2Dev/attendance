import React from 'react'
import {
  Box,
  Button,
  Chip,
  Grid,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import FlagIcon from '@mui/icons-material/Flag'
import SearchIcon from '@mui/icons-material/Search'
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral'
import Alert from '/imports/ui/utils/alert'

import { CartContext } from './cart-data'
import ProductCard from './product-card'
import Privacy, { SecurityModal } from './privacy'
import CONSTANTS from '/imports/api/constants'

const debug = require('debug')('app:checkout')
const NEED_DATE = 'paypal cash xero'.split(/\s+/)

const Checkout = ({ history }) => {
  const { state, dispatch } = React.useContext(CartContext)
  const [icon, setIcon] = React.useState('search')
  const [code, setCode] = React.useState('')
  const [promo, setPromo] = React.useState(null)
  const [member, setMember] = React.useState(null)
  const [method, setMethod] = React.useState('')
  const [showDate, setShowDate] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [note, setNote] = React.useState('')
  const [discountedPrice, setDP] = React.useState(state.price / 100)
  const promoIcon =
    icon && icon.match(/check/) ? (
      <CheckCircleIcon color="success" />
    ) : icon && icon.match(/cancel/) ? (
      <CancelIcon color="error" />
    ) : icon && icon.match(/meh/) ? (
      <SentimentNeutralIcon color="error" />
    ) : (
      <SearchIcon color="action" />
    )

  const adminCancel = () => {
    setPromo({ status: 'Please enter a discount code' })
    setIcon('meh outline')
  }

  const adminDoIt = async (e) => {
    e.preventDefault()
    try {
      switch (method) {
        case 'email':
          // Send an email containing the cart
          const status = await Meteor.callAsync(
            'member.email.invoice',
            state._id,
            email,
            note,
            discountedPrice * 100,
            state.discount
          )
          dispatch({ type: 'clear' }) // Clear the cart ??
          Alert.info(`Sent invoice to ${email}`)
          history.push(`/shop/sent/${email}`)
          break
        case 'charge':
          // Go to the Charge my card page...
          history.push(`/shop/charge/${member._id}/${state._id}`)
          break
        // it's paid already
        case 'paypal':
        case 'xero':
        case 'cash':
          markAsPaid(method)
          break
        default:
          Alert.error('Please choose an action')
          debug('Please choose something!')
          break
      }
    } catch (e) {
      console.error(`Something went wrong ${e.message}`)
    }
  }

  const changeMethod = (e) => {
    setMethod(e.target.value)
    setShowDate(NEED_DATE.includes(e.target.value))
  }

  const buyNow = () => {
    state.discount = 0
    if (state && state.member && state.member.paymentCustId)
      history.push(`/shop/charge/${state.member._id}/${state._id}`)
    else {
      history.push('/shop/address')
    }
  }

  const changeDiscount = (e) => {
    state.discount = e.target.value
    if (e.target.value.match(/^\$\d+/)) {
      const disc = parseInt(e.target.value.replace('$', ''))
      setDP(state.price / 100 - disc)
      dispatch({ type: 'discount', payload: disc })
    } else {
      const disc = parseInt(e.target.value) || 0
      setDP(state.price / 100 - disc)
      dispatch({ type: 'discount', payload: disc })
    }
  }
  const checkPromo = async () => {
    setIcon('ellipsis horizontal')
    debug(`Checking promo code ${code}`)
    // dispatch({ type: 'get-promo', payload: code })
    if (code) {
      const { promo, member } = await Meteor.callAsync(
        'getPromo',
        code,
        sessionStorage.getItem('memberId') || state.memberId
      )
      if (!promo) {
        setPromo({
          status: `Promo code "${code}" not found`,
        })
        setIcon('cancel')
      } else {
        debug('Promo', promo, member)
        setPromo(promo)
        setMember(member)
        setEmail(member.email)
        setIcon('check')
      }
    } else {
      setPromo({ status: 'Please enter a discount code' })
      setIcon('meh outline')
    }
  }

  const markAsPaid = async (paymentMethod) => {
    const result = await Meteor.callAsync(
      'markAsPaid',
      sessionStorage.getItem('mycart') || state._id,
      paymentMethod
    )
    if (result.status === 'ok') {
      history.push(`/shop/paid/${member?._id}`)
    } else {
      Alert.error(result.error)
    }
  }

  if (!state.products || !state.products.length) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5">Checkout</Typography>
        <Paper sx={{ p: 2, border: 1, borderColor: 'error.main' }}>
          <Typography>You have nothing in your shopping cart</Typography>
          <Button
            id="continue"
            type="button"
            variant="contained"
            onClick={() => history.push('/shop')}
            sx={{ mt: 2 }}
          >
            Continue shopping
          </Button>
        </Paper>
      </Stack>
    )
  }
  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Typography variant="h5">Checkout</Typography>
          <Privacy />
          <SecurityModal />
          <Box sx={{ ml: 'auto' }}>
            <Button
              type="button"
              variant="contained"
              color="success"
              id="menu_buy_now"
              onClick={buyNow}
            >
              Buy now {!state._id && '!'}
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {state.products.map((p) => (
            <ProductCard
              {...p}
              key={p._id}
              mode="remove"
              prodQty={state.prodqty[p._id]}
            />
          ))}
        </Box>
      </Paper>

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        flexWrap="wrap"
        justifyContent="center"
      >
        <Button
          id="continue"
          type="button"
          variant="contained"
          onClick={() => history.push('/shop/type/membership')}
        >
          Continue shopping
        </Button>
        <Button
          type="button"
          color="success"
          variant="contained"
          onClick={buyNow}
          id="buy_now"
        >
          Buy now {!state._id && '!'}
        </Button>
        <TextField
          size="small"
          placeholder="Promo code"
          onChange={(e) => setCode(e.target.value)}
          name="promo"
          InputProps={{
            startAdornment: <InputAdornment position="start">{promoIcon}</InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <Button id="check" onClick={checkPromo}>
                  Check
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {promo && promo.discount > 0 && !promo.admin && (
        <Typography align="center" variant="h6">
          <FlagIcon color="success" sx={{ mr: 1 }} />
          Yay! You found...
          <br />
          {promo.description}
          <br />
          Click on "Buy Now" to make use of your discount
        </Typography>
      )}
      {promo && promo._id && promo.admin && (
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, border: 1, borderColor: 'success.main' }}>
              <Stack spacing={2} alignItems="center">
                <FlagIcon color="success" />
                <Typography variant="h6">{promo.description}</Typography>
                <Typography variant="subtitle2">Select payment method</Typography>
                <Chip label={`Charge: $${discountedPrice}`} />
                <TextField
                  name="discount"
                  onChange={changeDiscount}
                  placeholder="Discount amount"
                  size="small"
                />
                <FormControl>
                  <RadioGroup name="method" value={method} onChange={changeMethod}>
                    {member && member.paymentCustId && (
                      <FormControlLabel
                        value="charge"
                        control={<Radio />}
                        label="Charge to credit card"
                      />
                    )}
                    <FormControlLabel
                      value="email"
                      control={<Radio />}
                      label="Send invoice by email"
                    />
                    <FormControlLabel
                      value="paypal"
                      control={<Radio />}
                      label="Paid via Paypal"
                    />
                    <FormControlLabel
                      value="xero"
                      control={<Radio />}
                      label="Paid in Xero"
                    />
                    <FormControlLabel
                      value="cash"
                      control={<Radio />}
                      label="Paid in cash"
                    />
                  </RadioGroup>
                </FormControl>
                {method === 'email' && (
                  <>
                    <TextField
                      name="note"
                      type="note"
                      placeholder="Note to add to email"
                      onChange={(e) => setNote(e.target.value)}
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <TextField
                      name="email"
                      type="email"
                      placeholder="Email"
                      defaultValue={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                    />
                  </>
                )}
                {showDate && (
                  <TextField
                    name="date"
                    placeholder="Date paid (leave blank for today)"
                    fullWidth
                  />
                )}
                <Stack direction="row" spacing={1}>
                  <Button
                    id="cancel"
                    type="button"
                    color="error"
                    variant="outlined"
                    onClick={adminCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    id="doit"
                    type="button"
                    color="success"
                    variant="contained"
                    onClick={adminDoIt}
                  >
                    Do it
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}
      {promo && promo.status && (
        <Typography align="center" color="error">
          <SentimentNeutralIcon sx={{ mr: 1 }} />
          {promo.status}
        </Typography>
      )}
    </Stack>
  )
}

export default Checkout
