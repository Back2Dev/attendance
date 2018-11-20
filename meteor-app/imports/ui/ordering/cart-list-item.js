import React from "react";
import PropTypes from "prop-types";
import { Table, Button, Label } from "semantic-ui-react";
const CartListItem = ({
  partId,
  name,
  partNo,
  price,
  qty,
  increaseQty,
  decreaseQty,
  removePart,
  order,
  oldOrder
}) => {
  return (
    <Table.Row>
      <Table.Cell collapsing textAlign="left">
        <Label ribbon size="big">
          {partNo}
        </Label>
      </Table.Cell>
      <Table.Cell className="partDescription">{name}</Table.Cell>
      <Table.Cell collapsing textAlign="left">
        ${Number(price / 100).toFixed(2)}
      </Table.Cell>
      <Table.Cell collapsing textAlign="left">
        {qty}
      </Table.Cell>
      <Table.Cell collapsing textAlign="left">
        ${Number((price * qty) / 100).toFixed(2)}
      </Table.Cell>
      {!oldOrder ? (
        <Table.Cell className="noPrint" collapsing textAlign="center">
          <Button.Group>
            <Button
              color="green"
              onClick={() => increaseQty(order._id, partId)}
            >
              +
            </Button>
            <Button onClick={() => decreaseQty(order._id, partId)}>-</Button>
            <Button color="red" onClick={() => removePart(order, partId)}>
              Delete
            </Button>
          </Button.Group>
        </Table.Cell>
      ) : (
        ""
      )}
    </Table.Row>
  );
};
CartListItem.propTypes = {
  partId: PropTypes.string,
  name: PropTypes.string.isRequired,
  partNo: PropTypes.string.isRequired,
  addedAt: PropTypes.object.isRequired,
  price: PropTypes.number.isRequired,
  qty: PropTypes.number.isRequired,
  userId: PropTypes.string
};
export default CartListItem;
