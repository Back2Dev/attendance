import React from 'react'
import moment from 'moment'
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material'
import { CartContext } from './cart-data'
import Price from './price'
import context from '/imports/ui/utils/nav'

const CCRegistered = props => {
  const { state, dispatch } = React.useContext(CartContext)

  const Address = props => (
    <div>
      {props.fields
        .filter(part => state.creditCard[`address_${part}`])
        .map(part => (
          <span key={part}>
            {state.creditCard[`address_${part}`]}
            <br />
          </span>
        ))}
    </div>
  )
  const Purchased = props => (
    <span>
      {props.items.map((item, ix) => (
        <span key={ix}>
          {item.qty} x {item.name} <Price cents={item.price} />
        </span>
      ))}
    </span>
  )

  const items = !state.creditCard
    ? [{ name: 'Status', value: <span>No data from server?</span> }]
    : [
        { name: 'Registered for', value: <Purchased items={state.products} /> },
        { name: 'Amount charged today', value: <Price cents={0} /> },
        { name: 'Name', value: state.creditCard.name },
        {
          name: 'Card',
          value: `${state.creditCard.scheme} ${state.creditCard.display_number}`
        },
        {
          name: 'Country of issue',
          value: state.creditCard.issuing_country
        },
        {
          name: 'Billing address',
          value: <Address fields={'line1 line2 city state postcode country'.split(/\s+/)} />
        },
        { name: 'Date', value: moment().format('DD-MM-YYYY') },
        { name: 'Time', value: moment().format('HH:MM:SS') }
      ]

  const gotoHome = e => {
    dispatch({ type: 'clear' }) // Clear the cart ??
    props.history.push(goHome())
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
        <Typography variant="h5">Card registered</Typography>
        <Table size="small" sx={{ mt: 2 }}>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.name}>
                <TableCell sx={{ width: '35%' }}>
                  <Typography variant="subtitle2">{item.name}</Typography>
                </TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="contained" color="success" onClick={gotoHome} sx={{ mt: 3 }}>
          Back to the checkin
        </Button>
      </Paper>
    </Container>
  )
}

export default CCRegistered
