import React from "react";
import {
  Header,
  Container,
  Segment,
  Table,
  Button,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./cart-list.css";
import ActiveOrder from "/imports/ui/ordering/active-orders.js";
import OldOrder from "/imports/ui/ordering/old-order.js";

const CartList = props => {
  let {
    order,
    removePart,
    increaseQty,
    decreaseQty,
    oldOrders,
    loading
  } = props;

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
            <Header as="h3" block>
              Orders
            </Header>
          </Segment>
          </Container>
        <ActiveOrder
          order={order}
          removePart={removePart}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
        />
         <Container textAlign="center">
        <Segment raised clearing className="review">
            <Header as="h3" block>
              Previous Orders
            </Header>
          </Segment>
          </Container>
        {oldOrders.map(order => {
         
          return <OldOrder key={order._id} order={order} />
        })}
      </div>
    </div>
  );
};
export default CartList;
