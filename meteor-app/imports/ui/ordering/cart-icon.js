import React from "react";
import { Icon, Button, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
const CartIcon = props => (
  <Link to="/ordering/cart">
    <Button as="div" labelPosition="right">
      <Button
        icon="cart"
        content={
          this.location.pathname === "/ordering/cart"
            ? "Total items"
            : "View Order"
        }
        primary
      />
      <Label basic pointing="left">
        {props.noOfParts}
      </Label>
    </Button>
  </Link>
);
export default CartIcon;
