import React from 'react'
import { Container, Segment, Header, Button, Image } from 'semantic-ui-react'
import { CartContext } from './cart-data'

const EmailSent = ({ history, match }) => {
  const { state, dispatch } = React.useContext(CartContext)

  const gotoHome = e => {
    dispatch({ type: 'clear' }) // Clear the cart ??
    history.push('/')
  }

  return (
    <Container text textAlign="center">
      <Segment textAlign="center">
        <Header as="h2">
          <Image src={state.settings.logo} />
        </Header>
        <Header as="h5">{state.settings.org}</Header>
        <Header as="h2">Paid </Header>
        <Button size="mini" type="button" color="green" onClick={gotoHome} style={{ marginTop: '24px' }}>
          Back to the checkin
        </Button>
      </Segment>
    </Container>
  )
}

export default EmailSent
