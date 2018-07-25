import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { Session } from "meteor/session";
import Cart from "/imports/ui/ordering/cart";
import Orders from "/imports/api/orders/schema";
import CONSTANT from "/imports/api/constants";
Session.set("searchQuery", "");
export default withTracker(props => {
  const ordersHandle = Meteor.subscribe("all.orders");

  const removePart = async (order, partId) => {
    const currentOrder = await Orders.findOne({ _id: order._id })
    const orderedParts = currentOrder.orderedParts
    const totalPrice = currentOrder.totalPrice
    orderedParts.forEach(part => {
      currentOrder.totalPrice = totalPrice - part.price;
      if (part.partId === partId) {
        Meteor.callAsync("orders.removePart", currentOrder, part, totalPrice)
      }
    });
  };
  const increaseQty = async (orderId, partId) => {
    const order = await Orders.findOne({ _id: orderId });
    let totalPrice = order.totalPrice;
    order.orderedParts.forEach(part => {
      if (part.partId === partId) {
        part.qty += 1;
        totalPrice += part.price;
        Meteor.callAsync(
          "order.updateQty",
          order._id,
          order.orderedParts,
          totalPrice
        );
      }
    });
  };
  const decreaseQty = async (orderId, partId) => {
    const order = await Orders.findOne({ _id: orderId })
    let totalPrice = order.totalPrice;
    order.orderedParts.forEach(part => {
      if (part.partId === partId) {
        part.qty -= 1;
        totalPrice -= part.price;
        part.qty < 1
          ? Meteor.callAsync("orders.removePart", order, part, totalPrice)
          : Meteor.callAsync(
              "order.updateQty",
              order._id,
              order.orderedParts,
              totalPrice
            );
      }
    });
  };
  return {
    removePart,
    increaseQty,
    decreaseQty,
    order: Orders.findOne({ status: CONSTANT.ORDER_STATUS_NEW }),
    loading: !ordersHandle.ready(),
    searchQuery: Session.get("searchQuery")
  };
})(Cart);
