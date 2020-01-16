import React from 'react'
import { Container, Segment, Card, Header, Button, Image } from 'semantic-ui-react'
import Alert from 'react-s-alert'
import CONSTANTS from '/imports/api/constants'
import { CartContext } from './cart-data'
import Price from './price'

const CCCharge = props => {
  const { state, dispatch } = React.useContext(CartContext)
  const [status, setStatus] = React.useState('')

  const gotoHome = e => {
    dispatch({ type: 'clear' }) // Clear the cart ??
    props.history.push('/') // Go home
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
      props.history.replace('/shop/receipt')
    }
  }
  return (
    <Container text textAlign="center">
      <Segment textAlign="center">
        <Header as="h2">
          <Image src={state.settings.logo} />
        </Header>
        <Header as="h5">{state.settings.org}</Header>
        <Header as="h2">Charge Credit Card </Header>
        <Header as="h2">
          <Image src="/images/cards.png" style={{ width: '10em', marginBottom: '4px' }}></Image>
        </Header>

        <Card.Group centered>
          <Card>
            <Card.Content>
              <Image floated="right" size="mini" src={`/images/avatars/${state.member.avatar}`} />
              <Card.Header>{state.member.name}</Card.Header>
              <Card.Meta>{state.member.email}</Card.Meta>
              <Card.Description>(Credit card details stored)</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div>
                <Button basic color="green" type="button" onClick={chargeCard}>
                  Charge: <Price cents={state.chargeAmount}></Price>
                </Button>
                <Button basic color="red" type="button" onClick={gotoHome}>
                  Cancel
                </Button>
              </div>
              {status}
            </Card.Content>
          </Card>
        </Card.Group>
      </Segment>
    </Container>
  )
}

export default CCCharge
