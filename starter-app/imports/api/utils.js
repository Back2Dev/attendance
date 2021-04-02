// utils.js
//
// Utility functions
//
const debug = require('debug')('b2b:utils')
const _ = require('lodash')
const nc = require('namecase')
import CONSTANTS from '/imports/api/constants'
const UNWANTED_CHARS = /[!\(\):;,\?"\+\\\/]*/g
const UNWANTED_NAMES = [
  // /nobody/i,
  // /no\s*one/i,
  // /none/i,
  // /anyone/i,
]

//
// Simple method to clean a name and capitalise it
// TODO: Preserve McArthur, MacArthur, O'Dowd, Bon-Scott etc
// TODO: Add a comparison function to be tolerant of these diffs too
//
export const clean_name = function (name) {
  let myName = _.deburr(name).trim() // Get rid of accents etc
  // Remove punctuation, brackets etc
  myName = myName.replace(UNWANTED_CHARS, '').trim()
  // Kick out known empty responses
  UNWANTED_NAMES.forEach((unwanted_name) => {
    if (myName.match(unwanted_name)) myName = ''
  })
  // Now do the McTavish thing
  myName = nc(myName.replace(/\s+/g, ' ').trim(), { individualFields: false })
  return myName
}

export const clean_name_list = function (name) {
  if (name) {
    // debug("input '"+name+"'")
    let names = name
    names = names.replace(/\./g, ' ')
    names = names.replace(/\n/g, ' ')
    names = names.replace(/ and /g, ' ')
    names = names.replace(/\&/g, ',')
    // Split list on commas and return
    let tmpNames = names.split(/,/g)
    let newNames = []
    if (tmpNames.length > 1) {
      const newNames = tmpNames.map((myName) => {
        const newName = clean_name(myName)
        if (newName && newName.length > 0) return newName
        else return null
      })
      debug(names, newNames)
      return newNames
    }

    // Split names on spaces and return
    let pairs = names.split(/\s+/g)
    newNames = []
    while (pairs.length >= 1) {
      let pair = pairs.shift()
      if (pairs.length > 0) pair = pair + ' ' + pairs.shift()
      pair = clean_name(pair)
      if (pair && pair.length > 0) newNames.push(pair)
    }
    debug(names, newNames)
    return newNames
  }
  return [] // Always return an array to be safe
}

// Shorten names (if too long), language/culture sensitive
export const shorten_name = (name, language) => {
  let ans = name
  if (name.length >= CONSTANTS.MAX_NAME_LENGTH) {
    const words = name.split(/[ \t]+/)
    const last = words.pop()
    const first = words.shift()
    let last2 = ''
    if (language === 'es' && words.length) {
      last2 = words.pop()
    }
    const initials = words.length ? words.map((w) => w.charAt(0)).join('') : ''
    ans = `${first} ${initials} ${last2} ${last}`
    // If it's still too long have another go
    if (ans.length > CONSTANTS.MAX_NAME_LENGTH) {
      ans = `${first} ${last2} ${last}`
    }
    // If it's still too long have another go
    if (ans.length > CONSTANTS.MAX_NAME_LENGTH) {
      const truncFirst =
        first.length > CONSTANTS.TRUNCATE_FIRST_NAME_AT
          ? `${first.substr(0, CONSTANTS.TRUNCATE_FIRST_NAME_AT)}...`
          : first
      ans = `${truncFirst} ${last2} ${last}`
    }
  }
  return ans
}

/**
 * Generate a CSV filename by slugifying a string and appending .csv
 * @param  {String} filename
 * @return {String}
 */
export const csvFileNameFor = (filename) =>
  `${filename.replace(/(^\W+|\W+$)/g, '').replace(/\W+/g, '-')}.csv`

/**
 * Sanitize a value for CSV exporting:
 * Joins arrays with a semi-colon,
 * converts undefined to empty string,
 * nukes linebreaks and commas.
 * @param  {String/String[]} value
 * @return {String}
 */
export function sanitizeValueForCSV(value) {
  if (_.isArray(value)) {
    return value.map(sanitizeValueForCSV).join('; ')
  }
  if (value === undefined || value === null) return ''
  if (_.isString(value) && value.match(/^0/)) {
    value = value.replace(/^0/, ' 0') // eslint-disable-line no-param-reassign
  }
  return value.toString().replace(/\n|,/g, ' ')
}
