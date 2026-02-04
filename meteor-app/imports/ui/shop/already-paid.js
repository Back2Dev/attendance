import React from 'react'
import { Box, Button, Container, Paper, Typography } from '@mui/material'
import { CartContext } from './cart-data'

const AlreadyPaid = props => {
  const { state, dispatch } = React.useContext(CartContext)

  const gotoShop = e => {
    dispatch({ type: 'clear' }) // Clear the cart ??
    props.history.push('/shop')
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5">Payment has already been completed</Typography>
        <Box
          component="img"
          src={state.settings.logo}
          alt={`${state.settings.org} logo`}
          sx={{ maxWidth: 200, my: 2 }}
        />
        <Typography>
          Transaction Date: {moment(props.cart.chargeResponse.created_at).format('DD/MM/YYYY h:mm:ss a')}
        </Typography>
        <Typography>Products: {props.cart.products.map(product => product.name).join(', ')}</Typography>
        <Typography>Amount: {'$' + props.cart.chargeAmount / 100}</Typography>
        <Typography>Card Number: {props.cart.chargeResponse.card.display_number}</Typography>
        <Button variant="contained" color="success" onClick={gotoShop} sx={{ mt: 3 }}>
          Back to the shop
        </Button>
      </Paper>
    </Container>
  )
}

export default AlreadyPaid
