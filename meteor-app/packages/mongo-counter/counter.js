// counter.js 
// Converted from counter.coffee by konecty:mongo-counter
//
import _ from 'lodash'

const getCounterCollection = collection => collection.rawCollection()

const callCounter = function(method, collection, ...args) {
  const Counters = getCounterCollection(collection)
  return Meteor.wrapAsync(_.bind(Counters[method], Counters))(...Array.from(args || []))
}

const _deleteCounters = collection => callCounter('remove', collection, {}, {safe: true})

const _incrementCounter = function(collection, counterName, amount) {
  if (amount == null) {
    amount = 1
  }
  const newDoc = callCounter(
    'findAndModify',
    collection,
    { _id: counterName },         // query
    null,                         // sort
    { $inc: { next_val: amount } },      // update
    { new: true, upsert: true }   // options
  )                               // callback added by wrapAsync
  if (newDoc && newDoc.value && newDoc.value.next_val) {
    return newDoc.value.next_val
  }
  return null
}


const _decrementCounter = function(collection, counterName, amount) {
  if (amount == null) { amount = 1 }
  return _incrementCounter(collection, counterName, -amount)
}


const _setCounter = function(collection, counterName, value) {
  callCounter(
    'update',
    collection,
    {_id: counterName},
    {$set: {next_val: value}}
  )
}

// Any variables defined without const/var/let are 'published' for the package

incrementCounter = _incrementCounter
decrementCounter = _decrementCounter
setCounter = _setCounter
deleteCounters = _deleteCounters
