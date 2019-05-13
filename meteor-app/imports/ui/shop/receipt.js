import React from 'react'
import moment from 'moment'
import { Container, Segment, Table, Header, Button, Icon, Image } from 'semantic-ui-react'
import { CartContext } from './cart-data'
import Price from './price'

const Receipt = props => {
  const { state, dispatch } = React.useContext(CartContext)

  const Address = props => (
    <div>
      {props.fields
        .filter(part => state.chargeResponse.card[`address_${part}`])
        .map(part => (
          <span key={part}>
            {state.chargeResponse.card[`address_${part}`]}
            <br />
          </span>
        ))}
    </div>
  )
  const Purchased = props => (
    <span>
      {props.items.map(item => (
        <span>
          {item.qty} x {item.name} <Price cents={item.price} />
        </span>
      ))}
    </span>
  )

  const items = [
    { name: 'Purchased', value: <Purchased items={state.products} /> },
    { name: 'Amount', value: <Price cents={state.chargeResponse.amount} /> },
    { name: 'Name', value: state.chargeResponse.card.name },
    {
      name: 'Card',
      value: `${state.chargeResponse.card.scheme} ${state.chargeResponse.card.display_number}`
    },
    {
      name: 'Country of issue',
      value: state.chargeResponse.card.issuing_country
    },
    {
      name: 'Billing address',
      value: <Address fields={'line1 line2 city state postcode country'.split(/\s+/)} />
    },
    { name: 'Date', value: moment().format('DD-MM-YYYY') },
    { name: 'Time', value: moment().format('HH:MM:SS') }
  ]

  return (
    <Container text textAlign="center">
      <Segment textAlign="center">
        <Header as="h2">
          <Image src={state.logo} />
        </Header>
        <Header as="h5">{state.org}</Header>
        <Header as="h2">Card payment receipt</Header>
        <Table basic="very" celled collapsing>
          <Table.Body>
            {items.map(item => (
              <Table.Row key={item.name}>
                <Table.Cell valign="top">
                  <Header as="h4">{item.name}</Header>
                </Table.Cell>
                <Table.Cell>{item.value}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    </Container>
  )
}

export default Receipt
