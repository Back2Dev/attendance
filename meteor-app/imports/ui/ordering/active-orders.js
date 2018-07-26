import React from "react";
import {
  Input,
  Header,
  Container,
  Segment,
  Table,
  Button,
  Icon
} from "semantic-ui-react";
import Component from "/imports/ui/ordering/cart-list-item";
import CartIcon from "/imports/ui/ordering/cart-icon";

const activeOrder = props => {
  let { order, removePart, increaseQty, decreaseQty, archiveOrder } = props;
  let noOfParts = 0;
  const printOrder = () =>{
    window.print()
  }
  return (
    <div>
      <Container textAlign="center" className="section-to-print">
        <Segment raised clearing className="review" color="blue" >
          {!props.loading &&
            order &&
            order.orderedParts.forEach(part => {
              noOfParts += part.qty;
              return noOfParts;
            })}
          <Header as="h3" block>
            Please review your current order
          </Header>
          <CartIcon noOfParts={noOfParts} />
          <Table striped size="large" celled compact="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Part #</Table.HeaderCell>
                <Table.HeaderCell>Part</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Qty</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell className="noPrint">Edit</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!props.loading &&
                order &&
                order.orderedParts.map(part => (
                  <Component
                    className="cart-item"
                    key={part.partId}
                    {...part}
                    order={order}
                    removePart={removePart}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                  />
                ))}
            </Table.Body>
          </Table>
          <Input fluid label="Additional Notes" />
          {!props.loading &&
            order && (
              <Header as="h3" block>
                Total Price: ${(order.totalPrice/100).toFixed(2)}
              </Header>
            )}
          <br />
          <Container>
          <Button.Group>
            <Button
              className="noPrint"
              primary
              onClick={() => {
                printOrder();
              }}
              size="big"
            >
              Print Order
            </Button>
            <Button.Or />
            <Button
              size="big"
              className="noPrint"
              color="olive"
              onClick={() => {
                archiveOrder(order);
              }}
            >
              Archive Order
            </Button>
          </Button.Group>
          </Container>
        </Segment>
      </Container>
    </div>
  );
};

export default activeOrder;
