import React from 'react'
import { Table, Button } from 'semantic-ui-react'


const CardListItem = (props) => {
  <Table.Row>
    <Table.Cell>{partNum}</Table.Cell>
    <Table.Cell>{desc}</Table.Cell>
    <Table.Cell>{retailPrice}</Table.Cell>
    <Table.Cell>{qty}</Table.Cell>
    <Table.Cell>{totalPrice}</Table.Cell>
    <Table.Cell>
      <Button.Group>
        <Button positive>Edit</Button>
        <Button negative>Delete</Button>
      </Button.Group>
    </Table.Cell>
  </Table.Row>
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

export default CardListItem