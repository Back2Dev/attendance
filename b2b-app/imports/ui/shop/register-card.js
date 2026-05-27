import React from 'react'
import { Box, Button, Container, Paper, Typography } from '@mui/material'
import { CartContext } from './cart-data'
import CONSTANTS from '/imports/api/constants'
import useHistory from '/imports/ui/utils/history'
import { useParams } from 'react-router-dom'

const debug = require('debug')('app:shop')

const RegisterCard = (props) => {
  const { id } = useParams()
  const history = useHistory()
  const { state, dispatch } = React.useContext(CartContext)

  const submit = (event) => {
    event.preventDefault()
    // Create an empty cart
    state.cartUpdate({
      prodqty: {},
      products: [],
      profileId: id,
    })
    history.push('/shop/address')
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5">{state.settings.org}</Typography>
        <Box
          component="img"
          src={state.settings.logo}
          alt={`${state.settings.org} logo`}
          sx={{ maxWidth: 200, my: 2 }}
        />
        <Typography variant="h5">Credit Card Registration</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          You can register your card details here.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Click Next to continue
        </Typography>
        <Button variant="contained" color="success" onClick={submit} sx={{ mt: 3 }}>
          Next
        </Button>
      </Paper>
    </Container>
  )
}

export default RegisterCard
