import { Meteor } from "meteor/meteor"
import { withTracker } from "meteor/react-meteor-data"
import { Session } from "meteor/session"
import Ordering from "/imports/ui/ordering/ordering"
import Parts from "/imports/api/parts/schema"
import Orders from "/imports/api/orders/schema"
import { ReactiveVar } from "meteor/reactive-var"
import Alert from "react-s-alert"
import CONSTANTS from "/imports/api/constants"
import { escapeRegExp } from "lodash"
const success = new ReactiveVar(false)
const error = new ReactiveVar(false)
const msg = new ReactiveVar("")
const newId = new ReactiveVar("")

function setError(e) {
  newId.set(null)
  error.set(true)
  success.set(false)
  msg.set(e.reason)
  Alert.error(e.reason)
}
Session.set("partSearchQuery", "")
export default withTracker(props => {
  const partsHandle = Meteor.subscribe("all.parts")
  const ordersHandle = Meteor.subscribe("all.orders")
  if (!partsHandle.ready()) {
    Session.set("partSearchQuery", "")
  }
  const filter = query => {
    const searching = query != ""
    if (searching) {
      return {
        $or: [
          {
            partNo: { $regex: new RegExp(escapeRegExp(query)), $options: "i" }
          },
          { name: { $regex: new RegExp(escapeRegExp(query)), $options: "i" } }
        ]
      }
    } else {
      return {}
    }
  }
  const addToCart = async orderedPart => {
    const currentOrder = await Orders.findOne({
      status: CONSTANTS.ORDER_STATUS_NEW
    })
    let totalPrice = currentOrder.totalPrice + orderedPart.price
    let orderedParts = currentOrder.orderedParts
    let found = orderedParts.find(function(part) {
      return part.partId === orderedPart.partId
    })
    if (!found) {
      const res = await Meteor.callAsync(
        "orders.addPart",
        currentOrder._id,
        orderedPart,
        totalPrice
      )
      if (res) {
        Alert.info(`Successfully added ${orderedPart.name} to cart`)
      }
    } else {
      orderedParts.forEach(p => {
        if (p.partId === orderedPart.partId) {
          p.qty += 1
          return p
        }
      })
      const res = await Meteor.callAsync(
        "order.updateQty",
        currentOrder._id,
        orderedParts,
        totalPrice
      )
      if (res) {
        Alert.info(`Successfully added ${orderedPart.name} to cart`)
      }
    }
  }
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
  }
  const onSearchInput = q => Session.set("partSearchQuery", q.target.value)

  return {
    activeOrder: Orders.findOne({ status: CONSTANTS.ORDER_STATUS_NEW }),
    addToCart,
    parts: Parts.find(filter(Session.get("partSearchQuery")), {
      skip: 0,
      limit: 50
    }).fetch(),
    loading: !partsHandle.ready() || !ordersHandle.ready(),
    partSearchQuery: Session.get("partSearchQuery"),
    onSearchInput
  }
})(Ordering)
