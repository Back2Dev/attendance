import moment from 'moment'
import { Meteor } from 'meteor/meteor'

// TODO: Move this to a more central location

export const accessByPath = (obj, path) => {
  if (typeof path !== 'string') return ''
  const paths = path.split('.')
  return paths.reduce((acc, path) => {
    if (!acc) return ''
    if (acc[path]) return acc[path] || ''
    return ''
  }, obj)
}

// Pruning
export const pruneByPath = (obj, path) => {
  if (typeof path !== 'string') return ''
  const paths = path.split('.')
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

export const convertMergeTags = (emailBody, tags) => {
  let newBody = emailBody
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
