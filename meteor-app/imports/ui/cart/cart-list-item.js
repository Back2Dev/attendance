import React from 'react'
import { Table, Button } from 'semantic-ui-react'


const CartListItem = (props) => {
  const { partId, part, partNo, addedAt, price, qty, userId } = props
  const roundedPrice = Math.round(price)
  const roundedQty = Math.round(qty)
  const roundedPartNo = Math.round(partNo)

  return (
    <Table.Row>
      <Table.Cell collapsing textAlign='left'>{roundedPartNo}</Table.Cell>
      <Table.Cell>{part}</Table.Cell>
      <Table.Cell collapsing >${roundedPrice}</Table.Cell>
      <Table.Cell collapsing >{roundedQty}</Table.Cell>
      <Table.Cell collapsing >${(roundedPrice * roundedQty)}</Table.Cell>
      <Table.Cell>
        <Button.Group collapsing>
          <Button positive>Edit</Button>
          <Button.Or />
          <Button negative>Delete</Button>
        </Button.Group>
      </Table.Cell>
    </Table.Row>
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

export default CartListItem