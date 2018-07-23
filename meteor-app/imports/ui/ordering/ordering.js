import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Grid, Segment, Header } from 'semantic-ui-react'

import PartCard from '/imports/ui/ordering/ordering-part-card'
import PartList from '/imports/ui/ordering/ordering-part-list'
import CartIcon from '/imports/ui/ordering/cart-icon'

class Ordering extends React.Component {
  render() {
  const { activeOrder } = this.props
  let noOfParts = 0
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
          <Segment raised>
            {(!this.props.loading && activeOrder) && activeOrder.orderedParts.forEach(part => {
              noOfParts += part.qty
              return noOfParts
            }) }
            <Header as='h2' textAlign='center'> <div>Parts</div>  <CartIcon noOfParts={noOfParts} /> </Header>
            

            </Segment>
            <PartList
              title={'Part Title:'}
              parts={this.props.parts}
              activeOrder={this.props.activeOrder}
              addToCart={this.props.addToCart}
              Component={PartCard}
              componentClassName='part-card-main'
              loading={this.props.loading}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default withRouter(Ordering)
