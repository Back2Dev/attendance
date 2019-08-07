import React from 'react'
import { Form, Header, Image, Container, Button, Message, Segment } from 'semantic-ui-react'
import { CartContext } from './cart-data'
import CONSTANTS from '/imports/api/constants'

const debug = require('debug')('b2b:shop')

const RegisterCard = props => {
  const { state, dispatch } = React.useContext(CartContext)

  const submit = event => {
    event.preventDefault()
    // Create an empty cart
    state.cartUpdate({
      prodqty: {},
      products: [],
      memberId: props.match.params.id
    })
    props.history.push('/shop/address')
  }

  return (
    <Container text textAlign="center">
      <Segment textAlign="center">
        <Header as="h2">{state.settings.org}</Header>
        <Header as="h2">
          <Image src={state.settings.logo} />
        </Header>
        <Header as="h2">Credit Card Registration</Header>
        <Header as="h2">You can register your card details here.</Header>
        <p> Click Next to continue</p>
        <Button size="mini" type="button" color="green" onClick={submit} style={{ marginTop: '24px' }}>
          Next
        </Button>
      </Segment>
    </Container>
  )
}

export default RegisterCard
