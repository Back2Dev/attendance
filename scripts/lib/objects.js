const debug = require('debug')('app:objects')

function deepEqual({ name, object1, object2, level = 0 }) {
  try {
    const keys1 = Object.keys(object1)
    const keys2 = Object.keys(object2)
    // debug(`deep=${keys1.join()}/${keys2.join()}`)
    const plus = keys2.filter((k2) => !keys1.includes(k2))
    const minus = keys1.filter((k1) => !keys2.includes(k1))
    if (plus.length || minus.length) {
      if (level < 2)
        debug(`${level} Different keys in ${name}: + ${plus.join()}, -${minus}`)
      return false
    }
    for (const key of keys1) {
      const val1 = object1[key]
      const val2 = object2[key]
      const areObjects = isObject(val1) && isObject(val2)
      if (
        (areObjects &&
          !deepEqual({ name, object1: val1, object2: val2, level: level + 1 })) ||
        (!areObjects && val1 !== val2)
      ) {
        if (level < 2)
          debug(
            `${level} Different values in ${name}: objects: ${areObjects} (${key}) ${val1}/${val2}`
          )
        return false
      }
    }
    return true
  } catch (e) {
    console.log(`deepEqual error : ${e.message}`)
    return false
  }
}
function isObject(object) {
  return object != null && typeof object === 'object'
}

module.exports = { deepEqual }
