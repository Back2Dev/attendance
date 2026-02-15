import { DateTime } from 'luxon'
import { last, first } from 'lodash'
import dbg from 'debug'
const debug = dbg('app:forms-util')

export const accessByPath = (obj, path) => {
  if (typeof path !== 'string') return ''
  const paths = path.split(/[\.\/]/g)
  return paths.reduce((acc, path) => {
    if (!acc) return ''
    if (acc[path]) return acc[path] || ''
    return ''
  }, obj)
}

// Pruning
export const pruneByPath = (obj, path) => {
  if (typeof path !== 'string') return ''
  const paths = path.split(/[\.\/]/g)
  return paths.reduce((acc, path, ix) => {
    if (!acc) return ''
    if (ix === paths.length - 1) {
      const pruned = acc[path]
      delete acc[path]
      return pruned
    }
    if (acc[path]) return acc[path] || ''
    return ''
  }, obj)
}

export const accessByPathNextLevel = (obj, path, mkpath) => {
  if (typeof path !== 'string') return ''
  if (!path.match(/\w+[\.\/\-]/)) return path
  const paths = path.split(/[\.\/]/g)
  return paths.reduce((acc, p) => {
    if (!acc) return ''
    if (Array.isArray(acc) && p.match(/=/)) {
      // This means we are looking at doing a filter() in an array
      const [key, value] = p.split(/=/)
      return acc.filter((item) => item[key] === value)
    } else {
      // Just an object, see if what it refers to is a  string
      if (typeof acc === 'object' && p.match(/=/)) {
        const [key, value] = p.split(/=/)
        if (typeof acc[key] === 'string') return acc[key] === value
      }
    }
    if (!acc[p] && mkpath) acc[p] = {}
    if (acc[p]) return acc[p] || ''
    return ''
  }, obj)
}

export const setByPath = (obj, path, value) => {
  if (typeof path !== 'string' || !value) return
  const paths = path.split(/[\.\/]/g)
  return paths.reduce((acc, path, ix) => {
    if (!acc) return ''
    if (!acc[path]) paths[ix + 1]?.match(/^\d+$/) ? (acc[path] = []) : (acc[path] = {})
    if (acc[path]) {
      if (ix === paths.length - 1) acc[path] = value
      return acc[path] || ''
    }
    return ''
  }, obj)
}
/**
 * These are utility functions that can be used to do calculations or formatting of the data
 * The first argument is the data object(s), and the second argument is the path of the value
 */
const funcs = {
  removeGST: (data, cost) => {
    const value = accessByPathNextLevel(data, cost)
    if (!value) return ''
    return Math.round((100 * parseInt(value)) / 110).toString()
  },

  plusGSTPrintable: (data, cost) => {
    const value = accessByPathNextLevel(data, cost)
    if (!value) return ''
    return `$${value} plus GST`
  },

  removeGSTPrintable: (data, cost) => {
    const value = accessByPathNextLevel(data, cost)
    if (!value) return ''
    return `$${Math.round((100 * parseInt(value)) / 110).toString()} plus GST`
  },

  GSTFrom: (data, cost) => {
    const value = accessByPathNextLevel(data, cost)
    if (!value) return ''
    return Math.round((10 * parseInt(value)) / 110).toString()
  },

  or: (data, choices) => {
    if (!Array.isArray(choices))
      throw new Error('Argument to "OR" function must be an array')
    return choices.reduce((acc, item) => {
      return acc || accessByPathNextLevel(data, item)
    }, '') // Return the first 'truthy' value
  },
  join: (data, choices) => {
    if (!Array.isArray(choices))
      throw new Error('Argument to "JOIN" function must be an array')
    return choices
      .map((item) => accessByPathNextLevel(data, item))
      .filter(Boolean)
      .join(' ')
  },
}

export const smartLookup = (data, src) => {
  let val = src // First guess is a literal  string
  if (typeof src === 'string' && src.match(/\w+[\.\/\-]\w+/))
    // Is it an object reference
    val = accessByPathNextLevel(data, src)
  if (Array.isArray(src))
    // Is it an array?
    val = src
      .map((item) => {
        return accessByPathNextLevel(data, item)
      })
      .join('')
  // Last gasp is a function or a formatter
  else if (typeof src === 'object' && src.src) {
    if (src.func) val = funcs[src.func] ? funcs[src.func](data, src.src) : src.toString()
    if (src.format) {
      let dt = accessByPathNextLevel(data, src.src)
      if (typeof dt === 'object' && !isNaN(dt.getTime())) {
        dt = DateTime.fromJSDate(dt)
        // At this stage we are dealing with a date
        if (src.format.match(/DATE|TIME/)) val = dt.toLocaleString(DateTime[src.format])
        else val = dt.toFormat(src.format)
      } else {
        // Room here to deal with non date-time formatting,
        // although we don't have a use-case for it yet, as functions will do this
        debug(`Value is not a date? `, val)
        val = accessByPathNextLevel(data, src.src)
      }
    }
  }
  return val
}

// Populate from webforms
export const populateDoc = (data, spec, docType) => {
  const newDoc = { type: docType, formData: {} }

  Object.keys(spec).forEach((targetKey) => {
    const src = spec[targetKey]
    const val = smartLookup(data, src)
    // if (val) debug(`populate ${docType}, ${targetKey}: "${val}"`)
    setByPath(newDoc.formData, targetKey, val)
  })
  return newDoc
}

export const cleanPhone = (ph) => {
  if (!ph || typeof ph !== 'string') return ''
  const newPh = ph.replace(/[\s\-\(\)]/g, '').replace(/^0/, '1')
  return !newPh.match(/^\+/) ? '+' + newPh : newPh
}

//
// This method extracts all the strings from an object, and smashes
// them together to make a searchable string (for easy searching)
// Parameters:
// obj - the object to extract strings from
// recurse - boolean - set to true if you want to recurse the object
//
const MAX_DEPTH = 20
let depth = 0
export const obj2Search = (obj, recurse) => {
  if (!obj) return ''
  return Object.keys(obj)
    .filter(
      (key) =>
        typeof obj[key] == 'string' ||
        (recurse && !key.match(/id$/i) && Array.isArray(Object.keys(obj[key])))
    )
    .map((key) => {
      if (typeof obj[key] == 'string') return obj[key]
      if (recurse) {
        depth = depth + 1
        if (depth > MAX_DEPTH) {
          depth = 0
          throw new Error(`Maximum recursion depth (${MAX_DEPTH}) reached, stopping`)
        }
        const a = obj2Search(obj[key], recurse)
        depth = depth - 1
        return a
      }
    })
    .filter((x) => x) // Clean out nulls and empty strings
    .join(' ') // Separated by spaces, but it probably doesn't matter
}

export function capitaliseFirst(string) {
  return string
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ')
}

export const wordSeparator = (array, word = 'and') => {
  if (array) {
    if (array.length === 1) return array[0]
    return array.slice(0, -1).join(', ') + ` ${word} ` + array.slice(-1)
  }
}

export const slugify = (text) => {
  if (!text || typeof text !== 'string') return 'no-name'
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
}

export const getUserNames = (text) => {
  if (!text || typeof text !== 'string') return 'no-name'
  const names = text.split(' ')
  return `${first(names)} ${last(names).charAt(0)}.`
}

// practice: {
//   'practice-name': 'Settle Easy VIC',
//   'practice-license': '001632L',
//   'practice-address': 'Level 6, 530 Collins St, Melbourne, VIC 3000',
//   'practice-abn': '20 625 000 651',
// },
// customer: {
//  signers: [
//   {signers-email: 'mike',
//    signers-name: 'mike'}
//   {signers-email: 'mike',
//    signers-name: 'mike'}
// ]

// What I would like back...
/* 
  {
   'practice-name':  'Settle Easy VIC',
   'practice-license': '001632L',
   'practice-address': 'Level 6, 530 Collins St, Melbourne, VIC 3000',
   'practice-abn': '20 625 000 651',
   'customer-signers-0-email': 
   'customer-signers-0-name': 
   'customer-signers-1-email': 
   'customer-signers-1-name': 
 }
*/
// {
//   "signers.0.signers-email": "mike@mike.com"
//   "signers.0.signers-name": "mike"
// }
const collapse = (path, key) => {
  const arr = path.concat(key)
  const res = arr.reduce((acc, item, ix) => {
    const re = new RegExp(`^${item}`)
    if (arr[ix + 1] && arr[ix + 1].match(re)) return acc
    return acc.concat(item)
  }, [])
  return res
}

let flatContext
export const flatten = (obj, context) => {
  if (!context) {
    flatContext = {
      path: [],
      results: {},
    }
  }
  if (!obj) return
  if (flatContext.path.length > MAX_DEPTH) {
    throw new Error(`Maximum recursion depth (${MAX_DEPTH}) reached, stopping`)
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, ix) => {
      flatContext.path.push(ix.toString())
      flatten(item, flatContext)
    })
  } else {
    if (typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        if (['string', 'number', 'boolean'].includes(typeof obj[key])) {
          const path = collapse(flatContext.path, key)
          flatContext.results[path.join('.')] = obj[key]
        } else {
          flatContext.path.push(key)
          flatten(obj[key], flatContext)
        }
      })
    }
  }
  if (flatContext.path.length) flatContext.path.pop()
  return flatContext.results
}

export const mapFields = (src, fieldMap) => {
  return Object.keys(fieldMap).reduce((acc, key) => {
    acc[key] = smartLookup(src, fieldMap[key])
    return acc
  }, {})
}

export const formatDate = (date) =>
  DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_SHORT)

//
// Utility function to get an id for the answer.
// Used to be `${q.id}__${a.id}`, but we are getting smarter.
// If there is only one attribute, it can be simply q.id
export const getQAId = (qId, answers, ix) => {
  const aid = answers && answers[ix] ? answers[ix].id : 'xx' //answers[0].id
  let qaId = `${qId}__${aid}`
  if (aid === 'xx') debug(qaId + ` ${ix}`, { qId, answers, ix })
  if (answers.length === 1) qaId = qId
  return qaId
}

export const guid = () => URL.createObjectURL(new Blob()).substr(-36)
