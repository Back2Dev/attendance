import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { Session } from 'meteor/session'
import Cart from '/imports/ui/ordering/cart'
import Orders from '/imports/api/orders/schema'

Session.set('searchQuery', '')

export default withTracker((props) => {
  const ordersHandle = Meteor.subscribe('all.orders')

  return {
    orders: Orders.find({}).fetch(),
    loading: !ordersHandle.ready(),
    searchQuery: Session.get('searchQuery'),
  }
})(Cart)