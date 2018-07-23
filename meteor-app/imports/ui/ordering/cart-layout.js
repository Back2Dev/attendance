import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { Session } from 'meteor/session'
import Cart from '/imports/ui/ordering/cart'
import Orders from '/imports/api/orders/schema'
import CONSTANT from '/imports/api/constants'
Session.set('searchQuery', '')

export default withTracker((props) => {
  const ordersHandle = Meteor.subscribe('all.orders')
  const removePart = async (OrderId, partId) => {
    const orderedParts = await Orders.findOne({ _id: OrderId}).orderedParts
    orderedParts.forEach(part => {
      if(part.partId === partId){
        Meteor.callAsync('orders.removePart', OrderId, part)
      }
    })
  }
  return {
    removePart,
    order: Orders.findOne({ status: CONSTANT.ORDER_STATUS_NEW }),
    loading: !ordersHandle.ready(),
    searchQuery: Session.get('searchQuery'),
  }
})(Cart)