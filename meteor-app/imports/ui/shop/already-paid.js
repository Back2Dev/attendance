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
        <div>Transaction Date: {moment(props.cart.chargeResponse.created_at).format('DD/MM/YYYY h:mm:ss a')}</div>
        <div>Products: {props.cart.products.map(product => product.name).join(', ')}</div>
        <div>Amount: {'$' + props.cart.chargeAmount / 100}</div>
        <div>Card Number: {props.cart.chargeResponse.card.display_number}</div>
        <Button size="mini" type="button" color="green" onClick={gotoShop} style={{ marginTop: '24px' }}>
          Back to the shop
        </Button>
      </Segment>
    </Container>
  )
}

export default AlreadyPaid
