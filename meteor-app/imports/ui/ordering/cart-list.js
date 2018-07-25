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
import { Link } from "react-router-dom";
import "./cart-list.css";
const CartList = props => {
  let { order, removePart, increaseQty, decreaseQty } = props;
  let noOfParts = 0;
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          height: "100%",
          alignContent: "center",
          justifyContent: "center"
        }}
      >
        <Container textAlign="center">
          <Link to="/ordering">
            <Button icon labelPosition="left" secondary>
              <Icon name="triangle left" />
              Back To Search
            </Button>
          </Link>
          <Segment raised clearing className="review">
            {!props.loading &&
              order &&
              order.orderedParts.forEach(part => {
                noOfParts += part.qty;
                return noOfParts;
              })}

            <Header as="h3" block>
              Review Shop Order{" "}
            </Header>
            <CartIcon noOfParts={noOfParts} />
          </Segment>
        </Container>
        <Container>
          <Table striped size="large" celled compact="very">
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
        </Container>
        <br />
        <Container textAlign="center">
          <Input fluid label="Additional Notes" />
          <Segment raised>
            {!props.loading &&
              order && (
                <Header as="h3" block>
                  Total Price: ${Number(order.totalPrice / 100).toFixed(2)}
                </Header>
              )}
            <br />
            <Button
              primary
              onClick={() => {
                window.print();
              }}
            >
              PRINT <br />ORDER
            </Button>
          </Segment>
        </Container>
      </div>
    </div>
  );
};
export default CartList;
