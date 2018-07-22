import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Grid, Segment } from 'semantic-ui-react'

import PartCard from '/imports/ui/ordering/ordering-part-card'
import PartList from '/imports/ui/ordering/ordering-part-list'
import CartIcon from '/imports/ui/ordering/cart-icon'

class Ordering extends React.Component {
  render() {
  let { order } = this.props
  let noOfParts = 0
    return (
      
      <Grid>
        <Grid.Row>
          <Grid.Column>
          <Segment raised>

            {(!this.props.loading && order) && order.orderedParts.forEach(part =>{
              noOfParts =+ part.qty
              return noOfParts
            }) }

            <CartIcon noOfParts={noOfParts} />

            </Segment>
            <PartList
              title={'Part Title:'}
              parts={this.props.parts}
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
