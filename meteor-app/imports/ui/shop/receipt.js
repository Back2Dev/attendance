import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Container, Segment, Table, Header, Button, Icon, Image } from 'semantic-ui-react'
import { CartContext } from './cart-data'
import Price from './price'

const Receipt = props => {
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
        { name: 'Purchased', value: <Purchased items={state.products} /> },
        { name: 'Amount', value: <Price cents={state.price} /> },
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

  const gotoShop = e => {
    sessionStorage.removeItem('mycart')
    props.history.push('/shop')
  }

  return (
    <Container text textAlign="center">
      <Segment textAlign="center">
        <Header as="h2">
          <Image src={state.settings.logo} />
        </Header>
        <Header as="h5">{state.settings.org}</Header>
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
        <Button size="mini" type="button" color="green" onClick={gotoShop} style={{ marginTop: '24px' }}>
          Back to the shop
        </Button>
      </Segment>
    </Container>
  )
}

Receipt.propTypes = {
  fields: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired
}
export default Receipt
