import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'
import Ordering from '/imports/ui/ordering/ordering'
import Parts from '/imports/api/parts/schema';
import Orders from '/imports/api/orders/schema';
import { ReactiveVar } from "meteor/reactive-var";
import Alert from 'react-s-alert';
import CONSTANTS from '/imports/api/constants'

const success = new ReactiveVar(false);
const error = new ReactiveVar(false);
const msg = new ReactiveVar("");
const newId = new ReactiveVar("");


function setError(e){
  newId.set(null)
  error.set(true)
  success.set(false)
  msg.set(e.reason)
  Alert.error(e.reason)
}

Session.set('searchQuery', '')

export default withTracker((props) => {

  function uploadXL(e) {
    e.preventDefault()
    const input = e.target[0]
    const reader = new FileReader()
    reader.onloadend = function () {
      const data = reader.result
      Meteor.callAsync('parts.load', data)
    }
    reader.readAsBinaryString(input.files[0])
  }

  const partsHandle = Meteor.subscribe('all.parts')
  const ordersHandle = Meteor.subscribe('all.orders')
  const addToCart = async (orderedPart) => {
    const currentOrder = await Orders.findOne({ status: CONSTANTS.ORDER_STATUS_NEW })
    let orderedParts = currentOrder.orderedParts
    let found = orderedParts.find(function(part) {
      return part.partId === orderedPart.partId
    });
      if (!found) {
      const res = await Meteor.callAsync('orders.addPart', currentOrder._id, orderedPart)
      if(res){
        alert(`Successfully added ${orderedPart.name} to cart`)
      }
      } else {
      orderedParts.forEach(p => {
        if (p.partId === orderedPart.partId){
           p.qty += 1
           return p
        }
      })
      const res = await Meteor.callAsync('order.updateQty', currentOrder._id, orderedParts)
      if(res){
        alert(`Successfully added ${orderedPart.name} to cart`)
      }
      }
    }
  
  return {
    activeOrder: Orders.findOne({ status: CONSTANTS.ORDER_STATUS_NEW }),
    addToCart,
    parts: Parts.find({}).fetch(),
    loading: !partsHandle.ready() || !ordersHandle.ready(),
    searchQuery: Session.get('searchQuery'),
    uploadXL
  }
})(Ordering)

