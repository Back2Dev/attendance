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
  userId
}) => {

  const priceInDollars = (price / 100)
  const totalItemPrice = (priceInDollars * qty)

  return (
    <Table.Row>
      <Table.Cell collapsing textAlign='left'>{partNo}</Table.Cell>
      <Table.Cell className='partDescription'>{name}</Table.Cell>
      <Table.Cell collapsing textAlign='center'>${Math.round(priceInDollars * 100) / 100}</Table.Cell>
      <Table.Cell collapsing textAlign='center'>{qty}</Table.Cell>
      <Table.Cell collapsing textAlign='center'>${Math.round(totalItemPrice * 100) / 100}</Table.Cell>
      <Table.Cell collapsing textAlign='center'>
        <Button.Group>
          <Button positive>Edit</Button>
          <Button.Or />
          <Button negative>Delete</Button>
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