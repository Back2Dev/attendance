// counter.js 
// Converted from counter.coffee by konecty:mongo-counter
//
const getCounterCollection = (collection) => collection.rawCollection()

const _deleteCounters = async (collection) => {
  const Counters = getCounterCollection(collection)
  return Counters.deleteMany({})
}

const _incrementCounter = async (collection, counterName, amount) => {
  if (amount == null) {
    amount = 1
  }
  const Counters = getCounterCollection(collection)
  const result = await Counters.findOneAndUpdate(
    { _id: counterName },
    { $inc: { next_val: amount } },
    { returnDocument: 'after', upsert: true }
  )
  if (result && result.value && result.value.next_val != null) {
    return result.value.next_val
  }
  return null
}

const _decrementCounter = async (collection, counterName, amount) => {
  if (amount == null) {
    amount = 1
  }
  return _incrementCounter(collection, counterName, -amount)
}

const _setCounter = async (collection, counterName, value) => {
  const Counters = getCounterCollection(collection)
  return Counters.updateOne(
    { _id: counterName },
    { $set: { next_val: value } },
    { upsert: true }
  )
}

// Any variables defined without const/var/let are 'published' for the package

incrementCounter = _incrementCounter
decrementCounter = _decrementCounter
setCounter = _setCounter
deleteCounters = _deleteCounters
