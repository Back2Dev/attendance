import React from 'react'
import { Container, Segment, Table, Header, Button, Icon, Image } from 'semantic-ui-react'
import { CartContext } from './cart-data'

const CCCharge = props => {
  const { state, dispatch } = React.useContext(CartContext)

  const gotoHome = e => {
    sessionStorage.setItem('mycart', null)
    props.history.push('/')
  }

  return (
    <Container text textAlign="center">
      <Segment textAlign="center">
        <Header as="h2">
          <Image src={state.settings.logo} />
        </Header>
        <Header as="h5">{state.settings.org}</Header>
        <Header as="h2">Charge Card </Header>
        <Button size="mini" type="button" color="green" onClick={gotoHome} style={{ marginTop: '24px' }}>
          Back to the checkin
        </Button>
      </Segment>
    </Container>
  )
}

export default CCCharge
