import React from 'react'
import moment from 'moment'
import { Container, Segment, Table, Header, Button, Icon, Image } from 'semantic-ui-react'
import { CartContext } from './cart-data'
import Price from './price'
import { Session } from 'meteor/session'

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
    sessionStorage.setItem('mycart', null)
    Session.equals('mode', '/kiosk')
      ? props.history.push('/kiosk')
      : Session.equals('mode', '/shop')
      ? props.history.push('/shop')
      : props.history.push('/volsignin')
  }

  return (
    <Container text textAlign="center">
      <Segment textAlign="center">
        <Header as="h2">
          <Image src={state.settings.logo} />
        </Header>
        <Header as="h5">{state.settings.org}</Header>
        <Header as="h2">Card registered</Header>
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
        <Button size="mini" type="button" color="green" onClick={gotoHome} style={{ marginTop: '24px' }}>
          Back to the checkin
        </Button>
      </Segment>
    </Container>
  )
}

export default CCRegistered
