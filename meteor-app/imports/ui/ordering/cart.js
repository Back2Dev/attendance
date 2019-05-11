import React, { Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Grid, Dimmer, Loader, Image } from 'semantic-ui-react'
import CartList from '/imports/ui/ordering/cart-list'
import '/imports/ui/ordering/cart.css'

const Cart = props => {
  const backClick = () => {
    props.history.goBack()
  }
  if (props.loading) {
    return (
      <div>
        <Dimmer active inverted>
          <Loader size="large">Loading</Loader>
        </Dimmer>

        <Image src="/images/wireframe/short-paragraph.png" />
      </div>
    )
  }
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column>
          <CartList
            order={props.order}
            componentClassName="cart-list-main"
            loading={props.loading}
            removePart={props.removePart}
            increaseQty={props.increaseQty}
            decreaseQty={props.decreaseQty}
            oldOrders={props.oldOrders}
            archiveOrder={props.archiveOrder}
            backClick={backClick}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default withRouter(Cart)
