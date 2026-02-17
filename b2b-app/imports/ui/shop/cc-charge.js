import React from 'react'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Paper,
  Typography,
} from '@mui/material'
import Alert from '/imports/ui/utils/alert'
import CONSTANTS from '/imports/api/constants'
import { CartContext } from './cart-data'
import Price from './price'
import useHistory from '/imports/ui/utils/history'

const CCCharge = props => {
  const history = useHistory()
  const { state, dispatch } = React.useContext(CartContext)
  const [status, setStatus] = React.useState('')

  const gotoHome = e => {
    dispatch({ type: 'clear' }) // Clear the cart ??
    history.push('/') // Go home
  }

  const chargeCard = async () => {
    setStatus('Contacting payment gateway...')
    const codes = state.products
      .map(prod => {
        return prod.qty === 1 ? prod.code : `${prod.qty}x${prod.code}`
      })
      .join(',')

    const result = await state.chargeCard({
      price: state.chargeAmount,
      customer_token: state.member.paymentCustId,
      email: state.member.email,
      metadata: { cartId: state._id, codes }
    })
    if (result.error) {
      const errMsg = result.error.match(/could not be found/i) ? 'Customer not found' : result.error
      Alert.error(errMsg)
      setStatus(`Error: ${errMsg}`)
    } else {
      // So show the payment receipt now
      Alert.success('Payment completed')
      state.status = CONSTANTS.CART_STATUS.COMPLETE
      setStatus('Transaction completed')
      history.replace('/shop/receipt')
    }
  }
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Box
          component="img"
          src={state.settings.logo}
          alt={`${state.settings.org} logo`}
          sx={{ maxWidth: 200, my: 2 }}
        />
        <Typography variant="subtitle1">{state.settings.org}</Typography>
        <Typography variant="h5">Charge Credit Card</Typography>
        <Box
          component="img"
          src="/images/cards.png"
          alt="Accepted cards"
          sx={{ width: 160, my: 1 }}
        />

        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={`/images/avatars/${state.member.avatar}`} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h6">{state.member.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {state.member.email}
                </Typography>
                <Typography variant="body2">(Credit card details stored)</Typography>
              </Box>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button variant="contained" color="success" type="button" onClick={chargeCard}>
              Charge: <Price cents={state.chargeAmount} />
            </Button>
            <Button variant="outlined" color="error" type="button" onClick={gotoHome}>
              Cancel
            </Button>
          </CardActions>
          {status && (
            <Typography variant="body2" sx={{ pb: 2 }}>
              {status}
            </Typography>
          )}
        </Card>
      </Paper>
    </Container>
  )
}

export default CCCharge
