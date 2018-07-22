import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'
import Ordering from '/imports/ui/ordering/ordering'
import Parts from '/imports/api/parts/schema';
import Orders from '/imports/api/orders/schema';
import { ReactiveVar } from "meteor/reactive-var";
import Alert from 'react-s-alert';


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
  const partsHandle = Meteor.subscribe('all.parts')
  const ordersHandle = Meteor.subscribe('all.orders')
  const addToCart = async (orderedPart) => {
    const currentOrder = await Orders.findOne({status: 1}).orderedParts
    let found = currentOrder.find(function(part) {
      return part.partId === orderedPart.partId
    });
      if (!found) {
      const res = await Meteor.callAsync('orders.update', orderedPart)
      return res
      } else {
      currentOrder.forEach(p => {
        if (p.partId === orderedPart.partId){
           p.qty += 1
           return p
        }
      })
      const res = await Meteor.callAsync('orders.qtyUpdate', currentOrder)
      return res
      }
    }
  
  return {
    activeOrder: Orders.findOne({status: 1}),
    addToCart,
    parts: Parts.find({}).fetch(),
    loading: !partsHandle.ready() && !ordersHandle.ready(),
    searchQuery: Session.get('searchQuery'),

  }
})(Ordering)

