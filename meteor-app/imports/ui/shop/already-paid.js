import React from 'react'
import { Header, Image, Container, Button, Segment } from 'semantic-ui-react'
import { CartContext } from './cart-data'

const AlreadyPaid = props => {
  const { state, dispatch } = React.useContext(CartContext)

  const gotoShop = e => {
    dispatch({ type: 'clear' }) // Clear the cart ??
    props.history.push('/shop')
  }

  return (
    <Container text textAlign="center">
      <Segment textAlign="center">
        <Header as="h2">Payment has already been completed</Header>
        <Header as="h2">
          <Image src={state.settings.logo} />
        </Header>
        <div>Transaction Date: {moment(state.chargeResponse.created_at).format('DD-MM-YY h:mm:ss a')}</div>
        <div>Products: {state.products.map(product => product.name).join(', ')}</div>
        <div>Amount: {'$' + state.chargeAmount / 100}</div>
        <div>Card Number: {state.chargeResponse.card.display_number}</div>
        <Button size="mini" type="button" color="green" onClick={gotoShop} style={{ marginTop: '24px' }}>
          Back to the shop
        </Button>
      </Segment>
    </Container>
  )
}

export default AlreadyPaid
