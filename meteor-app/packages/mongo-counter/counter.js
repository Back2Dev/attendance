/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let decrementCounter, deleteCounters, incrementCounter, setCounter;
const getCounterCollection = collection => collection.rawCollection();


const callCounter = function(method, collection, ...args) {
  const Counters = getCounterCollection(collection);
  if (Meteor.wrapAsync != null) {
    return Meteor.wrapAsync(_.bind(Counters[method], Counters))(...Array.from(args || []));
  } else {
    const future = new (Npm.require(Npm.require('path').join('fibers', 'future')))();
    Counters[method].call(Counters, ...Array.from(args), future.resolver());
    return future.wait();
  }
};


const _deleteCounters = collection => callCounter('remove', collection, {}, {safe: true});


const _incrementCounter = function(collection, counterName, amount) {
  if (amount == null) { amount = 1; }
  const newDoc = callCounter(
    'findAndModify',
    collection,
    {_id: counterName},         // query
    null,                       // sort
    {$inc: {next_val: amount}},      // update
    {new: true, upsert: true}  // options
  );                             // callback added by wrapAsync
  return __guard__(newDoc != null ? newDoc.value : undefined, x => x.next_val) || newDoc.next_val;
  // return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
};


const _decrementCounter = function(collection, counterName, amount) {
  if (amount == null) { amount = 1; }
  return _incrementCounter(collection, counterName, -amount);
};


const _setCounter = function(collection, counterName, value) {
  callCounter(
    'update',
    collection,
    {_id: counterName},
    {$set: {next_val: value}}
  );
};


if (typeof Package !== 'undefined' && Package !== null) {
  // console.log("pkg defined")
  incrementCounter = _incrementCounter;
  decrementCounter = _decrementCounter;
  setCounter = _setCounter;
  deleteCounters = _deleteCounters;
} else {
  // console.log("pkg ! defined")
  this.incrementCounter = _incrementCounter;
  this.decrementCounter = _decrementCounter;
  this.setCounter = _setCounter;
  this.deleteCounters = _deleteCounters;
}
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
