import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { Session } from 'meteor/session'
import Cart from '/imports/ui/ordering/cart'
import Orders from '/imports/api/orders/schema'
import CONSTANT from '/imports/api/constants'
Session.set('searchQuery', '')

export default withTracker((props) => {
  const ordersHandle = Meteor.subscribe('all.orders')
  const removePart = (OrderId, partId) => {
    const order = Orders.findOne({ _id: OrderId})
    order.orderedParts.forEach(part => {
      if(part.partId === partId){
        order.totalPrice = order.totalPrice - (part.price * part.qty)
        Meteor.callAsync('order.update', order._id, order)
        Meteor.callAsync('orders.removePart', order, part )
      }
    })
  }
  
  const increaseQty = (orderId, partId) => {
    const order = Orders.findOne({ _id: orderId})
    order.orderedParts.forEach(part => {
      if(part.partId === partId){
        part.qty += 1
        order.totalPrice += part.price
        Meteor.callAsync('order.update', order._id, order)
      }
    })
  } 

  const decreaseQty = (orderId, partId) => {
    const order = Orders.findOne({ _id: orderId})
    order.orderedParts.forEach(part => {
      if(part.partId === partId && part.qty == 1){
        order.totalPrice -= part.price
        Meteor.callAsync('order.update', order._id, order)
        Meteor.callAsync('orders.removePart', order, part)
      }
      else if (part.partId === partId){
        part.qty -= 1
        order.totalPrice -= part.price
        Meteor.callAsync('order.update', order._id, order)
      }
    })
  }

  return {
    removePart,
    increaseQty,
    decreaseQty,
    order: Orders.findOne({ status: CONSTANT.ORDER_STATUS_NEW }),
    loading: !ordersHandle.ready(),
    searchQuery: Session.get('searchQuery'),
  }
})(Cart)
