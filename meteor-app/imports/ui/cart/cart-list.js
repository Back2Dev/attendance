import React from 'react'
import { Table, Button } from 'semantic-ui-react'

import CartListItem from './cart-list-item'

const CartList = (props) => {
  const { status, additionalNotes, totalPrice, orderedParts } = props
  const componentOrderedParts = orderedParts.map(part => {
    return <CartListItem {...part} />
  })

  return (
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
  )
}

// CardListItem.propTypes = {
//   className: PropTypes.string,
//   _id: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   avatar: PropTypes.string.isRequired,
//   isHere: PropTypes.bool.isRequired,
//   sessions: PropTypes.array.isRequired,
//   lastIn: PropTypes.object,
//   sessionCount: PropTypes.number.isRequired,
// };

export default CartList