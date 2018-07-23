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
  const increaseQty = async (orderId, partId) => {
    const order = await Orders.findOne({ _id: orderId})
    order.orderedParts.forEach(part => {
      if(part.partId === partId){
        part.qty += 1
        Meteor.callAsync('order.updateQty', order._id, order.orderedParts)
      }
    })
  } 

  const decreaseQty = async (orderId, partId) => {
    const order = await Orders.findOne({ _id: orderId})
    order.orderedParts.forEach(part => {
      if(part.partId === partId){
        part.qty -= 1
        Meteor.callAsynch('order.updateQty', order._id, order.orderedParts)
      }
    })
  }
  
  return {
    removePart,
    increaseQty,
    order: Orders.findOne({ status: CONSTANT.ORDER_STATUS_NEW }),
    loading: !ordersHandle.ready(),
    searchQuery: Session.get('searchQuery'),
  }
})(Cart)