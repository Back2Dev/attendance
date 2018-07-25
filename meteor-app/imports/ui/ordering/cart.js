import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import CartList from '/imports/ui/ordering/cart-list'
import '/imports/ui/ordering/cart.css'

class Cart extends React.Component {
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <CartList
              order={this.props.order}
              componentClassName='cart-list-main'
              loading={this.props.loading}
              removePart={this.props.removePart}
              increaseQty={this.props.increaseQty}
              decreaseQty={this.props.decreaseQty}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default withRouter(Cart)