import React from 'react'
import { Input, Divider, Container, Segment, Table, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'

import CartListItem from './cart-list-item'

const CartList = (props) => {
  const { status, additionalNotes, totalPrice, orderedParts } = props
  const componentOrderedParts = orderedParts.map(part => {
    return <CartListItem {...part} />
  })

  return (
    <div>
      <Container>
        <Table striped size='large' celled compact='very' singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Part #</Table.HeaderCell>
              <Table.HeaderCell>Part</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Qty</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Edit</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {componentOrderedParts}
          </Table.Body>
        </Table>
      </Container>

      <Divider />

      <Container textAlign='center'>
        <Input fluid label='Additional Notes' />
        <Segment text raised>
          Total Price: ${totalPrice}
          <br />
          <Button primary>
            CONFIRM ORDER
        </Button>
        </Segment>
      </Container>
    </div>
  )
}

CartList.propTypes = {
  status: PropTypes.number.isRequired,
  additionalNotes: PropTypes.string,
  totalPrice: PropTypes.number.isRequired,
  orderedParts: PropTypes.array.isRequired
};

export default CartList