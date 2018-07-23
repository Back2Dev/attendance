import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button } from 'semantic-ui-react'


const CartListItem = ({
  partId,
  name,
  partNo,
  addedAt,
  price,
  qty,
  userId,
  increaseQty,
  decreaseQty,
  removePart,
  orderId
}) => {

  const priceInDollars = (price / 100)
  const totalItemPrice = (priceInDollars * qty)

  return (
    <Table.Row >
      <Table.Cell collapsing textAlign='left'>{partNo}</Table.Cell>
      <Table.Cell className='partDescription'>{name}</Table.Cell>
      <Table.Cell collapsing textAlign='left'>${Math.round(priceInDollars * 100) / 100}</Table.Cell>
      <Table.Cell collapsing textAlign='left'>{qty}</Table.Cell>
      <Table.Cell collapsing textAlign='left'>${Math.round(totalItemPrice * 100) / 100}</Table.Cell>
      <Table.Cell collapsing textAlign='center'>
        <Button.Group >
          <Button color="green" onClick={() => increaseQty(orderId, partId)} >+</Button>
          <Button onClick={() => decreaseQty(orderId, partId)} >-</Button>
          <Button color='red' onClick={() => removePart(orderId, partId)}>Delete</Button>
        </Button.Group>
      </Table.Cell>
    </Table.Row>
  )
}

CartListItem.propTypes = {
  partId: PropTypes.string,
  name: PropTypes.string.isRequired,
  partNo: PropTypes.string.isRequired,
  addedAt: PropTypes.object.isRequired,
  price: PropTypes.number.isRequired,
  qty: PropTypes.number.isRequired,
  userId: PropTypes.string,
};

export default CartListItem