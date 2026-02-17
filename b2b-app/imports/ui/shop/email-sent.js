import React from 'react'
import { Box, Button, Container, Paper, Typography } from '@mui/material'
import { CartContext } from './cart-data'

const EmailSent = ({ history, match }) => {
  const { state, dispatch } = React.useContext(CartContext)

  const gotoHome = e => {
    dispatch({ type: 'clear' }) // Clear the cart ??
    history.push('/')
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
        <Typography variant="h5">Email sent to {match.params.email}</Typography>
        <Button variant="contained" color="success" onClick={gotoHome} sx={{ mt: 3 }}>
          Back to the checkin
        </Button>
      </Paper>
    </Container>
  )
}

export default EmailSent
