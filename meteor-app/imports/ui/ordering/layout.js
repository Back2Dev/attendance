import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'
import Ordering from '/imports/ui/ordering/ordering'
import Parts from '/imports/api/parts/schema';
import Orders from '/imports/api/orders/schema'

Session.set('searchQuery', '')

export default withTracker((props) => {
  const partsHandle = Meteor.subscribe('all.parts')
  const ordersHandle = Meteor.subscribe('all.orders')
  return {
    order: Orders.findOne({ status: 1 }),
    parts: Parts.find({}).fetch(),
    loading: !partsHandle.ready() && !ordersHandle.ready(),
    searchQuery: Session.get('searchQuery'),
  }
})(Ordering)