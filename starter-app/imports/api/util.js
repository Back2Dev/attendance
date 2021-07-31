import moment from 'moment'
import { Meteor } from 'meteor/meteor'
const debug = require('debug')('app:util')

// TODO: Move this to a more central location

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
  if (!path.match(/\w+[\.\/]/)) return path
  const paths = path.split(/[\.\/]/g)
  return paths.reduce((acc, path) => {
    if (!acc) return ''
    if (Array.isArray(acc) && path.match(/=/)) {
      // This means we are looking at doing a filter() in an array
      const [key, value] = path.split(/=/)
      return acc.filter((item) => item[key] === value)
    }
    if (!acc[path] && mkpath) acc[path] = {}
    if (acc[path]) return acc[path] || ''
    return ''
  }, obj)
}

export const setByPath = (obj, path, value) => {
  if (typeof path !== 'string') return
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

const funcs = {
  removeGST: (data, cost) => {
    const value = accessByPathNextLevel(data, cost)
    if (!value) return ''
    return Math.round((100 * parseInt(value)) / 110).toString()
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
}

// Populate from listing or webforms
export const populateDoc = (data, spec, docType) => {
  const newDoc = { type: docType, formData: {} }

  Object.keys(spec).forEach((targetKey) => {
    const src = spec[targetKey]
    // debug({ src })
    let val = src
    if (typeof src === 'string' && src.match(/\w+[\.\/]\w+/))
      val = accessByPathNextLevel(data, src)
    if (Array.isArray(src))
      val = src
        .map((item) => {
          return accessByPathNextLevel(data, item)
        })
        .join('')
    else if (typeof src === 'object' && Object.keys(src).length) {
      const funcName = Object.keys(src)[0]
      val = funcs[funcName] ? funcs[funcName](data, src[funcName]) : src
    }
    debug('populate', targetKey, val)
    setByPath(newDoc.formData, targetKey, val)
  })
  return newDoc
}

export const cleanPhone = (ph) => {
  if (!ph || typeof ph !== 'string') return ''
  return ph.replace(/[\s\-\(\)]/g, '').replace(/^0/, '+61')
}

export const makeUserSerial = (id, first, last) => {
  return `SE${first.charAt(0) || 'x'}${last.charAt(0) || 'x'}${1000 + id}`.toUpperCase()
}

export const makeListingSerial = (id) => {
  return `${moment().format('YYYYMM')}${1000 + id}`
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
        (typeof obj[key] == 'string' ||
          (recurse && Array.isArray(Object.keys(obj[key])))) &&
        !key.match(/id$/i)
    )
    .map((key) => {
      if (typeof obj[key] == 'string') return obj[key]
      if (recurse) {
        depth = depth + 1
        if (depth > MAX_DEPTH) {
          depth = 0
          throw `Maximum recursion depth (${MAX_DEPTH}) reached, stopping`
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

const aTagMerge = (body, tags) => {
  const aTagRegex = /\[(.*?)]\s\((.*?)\)/g
  if (!body.match(aTagRegex)) return body
  let data = body.match(aTagRegex).reduce((acc, f) => {
    const text = f.match(/\[(.*?)]/)[1]
    const href = tags[f.match(/([^*|]+(?=\|\*))/)[1]]
    acc[f] = `<a href=${href}>${text}</a>`
    return acc
  }, {})

  return body
    .match(aTagRegex)
    .reduce((acc, f) => {
      return acc.replace(f, data[f])
    }, body)
    .split(/\n/)
    .map((line) => {
      return line
    })
    .join('')
}

export const convertMergeTags = (emailBody, tags) => {
  let newBody = emailBody
  newBody = aTagMerge(newBody, tags)
  Object.keys(tags).forEach((oldTag) => {
    newBody = newBody.replace(`*|${oldTag}|*`, tags[oldTag])
  })

  return newBody
}

export const convertLink = (link, tags) => {
  let newLink = link
  Object.keys(tags).forEach((oldTag) => {
    if (tags[oldTag]) {
      newLink = newLink.replace(`:${oldTag}`, tags[oldTag])
    }
  })
  return newLink
}

// This checks whether the avatar is stored on our server (starts with /user-profile-photo) or with socials
export const convertAvatar = (avatar) => {
  const re = /^(https)/
  if (re.test(avatar)) {
    return avatar
  } else if (!avatar) {
    return null
  } else {
    return Meteor.settings.public.S3_PUBLIC_URL + avatar
  }
}

export const wordSeparator = (array, word = 'and') => {
  if (array) {
    if (array.length === 1) return array[0]
    return array.slice(0, -1).join(', ') + ` ${word} ` + array.slice(-1)
  }
}
