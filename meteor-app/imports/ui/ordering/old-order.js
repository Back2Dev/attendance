import React from 'react';
import PropTypes from 'prop-types';
import { humaniseDateDay } from '/imports/helpers/dates'
import {
  Input,
  Header,
  Container,
  Segment,
  Table,
  Button,
  Icon,

} from "semantic-ui-react";
import Component from "/imports/ui/ordering/cart-list-item";
import CartIcon from "/imports/ui/ordering/cart-icon";

const oldOrderComponent = props => {
  const order = props.order
  return (
    <div>
    <Container textAlign="center">
      <Segment raised clearing className="review">
        <Header as="h3">
          {humaniseDateDay(order.updatedAt)} 
        </Header>
        <CartIcon noOfParts={order.orderedParts.length} />

        <Table striped size="large" celled compact="very" color="blue">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Part #</Table.HeaderCell>
              <Table.HeaderCell>Part</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Qty</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
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
                  oldOrder={true}
                />
              ))}
          </Table.Body>
        </Table>
        <Input fluid label="Additional Notes" />

        {!props.loading &&
          order && (
            <Header as="h2" >
              Total Price: ${(order.totalPrice/100).toFixed(2)}
            </Header>
          )}
        <br />
      </Segment>
    </Container>

</div>
  );
};

oldOrderComponent.propTypes = {
  
};

export default oldOrderComponent;