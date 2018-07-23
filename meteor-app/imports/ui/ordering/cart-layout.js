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
        orderedParts.totalPrice = (orderedParts.totalPrice - (part.price * part.qty))
        Meteor.callAsync('orders.removePart', OrderId, part)
      }
    })
  }
  const increaseQty = async (orderId, partId) => {
    const order = await Orders.findOne({ _id: orderId})
    order.orderedParts.forEach(part => {
      if(part.partId === partId){
        part.qty += 1
        order.totalPrice += part.price
        Meteor.callAsync('order.update', order._id, order)
      }
    })
  } 

  const decreaseQty = async (orderId, partId) => {
    const order = await Orders.findOne({ _id: orderId})
    order.orderedParts.forEach(part => {
      if(part.partId === partId && part.qty == 1){
        order.orderedParts.totalPrice -= part.price
        Meteor.callAsync('orders.removePart', orderId, part)
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