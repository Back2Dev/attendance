import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import CartList from '/imports/ui/ordering/cart-list'

class Cart extends React.Component {
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <CartList
              title={'Cart List:'}
              order={this.props.order}
              componentClassName='cart-list-main'
              loading={this.props.loading}
              removePart={this.props.removePart}
          
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default withRouter(Cart)