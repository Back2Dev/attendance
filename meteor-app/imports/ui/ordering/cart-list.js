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
    loading,
    archiveOrder
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
       
            <Header as="h2" block>
              Orders
            </Header>
    
        <ActiveOrder
          order={order}
          removePart={removePart}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          archiveOrder={archiveOrder}
        />
         <Container textAlign="center">
        <Segment raised clearing className="review" secondary color="olive" inverted>
            <Header as="h3">
              Previous Orders
            </Header>
        
        {oldOrders.map(order => {
         
          return <OldOrder key={order._id} order={order} />
        })}
          </Segment>
          </Container>
    
          </Container>
      </div>
    </div>
  );
};
export default CartList;
