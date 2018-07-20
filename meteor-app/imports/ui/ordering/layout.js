import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'
import Ordering from '/imports/ui/ordering/ordering'
import Parts from '/imports/api/parts/schema';
import Order from '/imports/api/orders/schema';

Session.set('searchQuery', '')

export default withTracker((props) => {
  const partsHandle = Meteor.subscribe('all.parts')
  let activeOrder = Order.findOne({status: 1})
  const addToCart = async (orderedParts) => {
    try {
      const res = await Meteor.callAsync("orders.update", orderedParts)
      setSuccess("Successfully added another part", res)
      return res
    } catch (e) {
      setError(e)
    }

  }
  
  return {
    activeOrder,
    addToCart,
    parts: Parts.find({}).fetch(),
    loading: !partsHandle.ready(),
    searchQuery: Session.get('searchQuery'),

  }
})(Ordering)

