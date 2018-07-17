// copied from member-add-success.js  -  can use similar file when part added to order?

import React from 'react'
import PropTypes from 'prop-types';
import { Card, Grid, Header, Message } from 'semantic-ui-react'
import PartCard from '/imports/ui/member/ordering-part-card'

const OrderingAddSuccess = (props) => {

  return (
    <Grid centered style={{ height: '100%' }} verticalAlign='middle' textAlign='center' >
      <Grid.Column>
        <Message>
          <Message.Header>
            Part was successfully added to the current order.
        </Message.Header>
          <p>To add further parts please search again.</p>
          <p>Part added to order:</p>
        </Message>
        <Card.Group centered>
          <PartCard
            {...props.part}
            onCardClick={f => f}
          />
        </Card.Group>
      </Grid.Column>
    </Grid>
  )
}

OrderingAddSuccess.propTypes = {
};

export default OrderingAddSuccess
