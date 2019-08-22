/**
 * util/csv.js
 *
 * utilities for creating and exporting CSVs
 */
import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'

/**
 * Generate a CSV filename by slugifying a string and appending .csv
 * @param  {String} string
 * @return {String}
 */
export const csvFileNameFor = string => `${string.replace(/(^\W+|\W+$)/g, '').replace(/\W+/g, '-')}.csv`

/**
 * Sanitize a value for CSV exporting:
 * Returns URLs from Filestack objects,
 * Joins arrays with a semi-colon,
 * converts undefined to empty string,
 * nukes linebreaks and commas.
 * @param  {String/String[]} value
 * @return {String}
 */
export function sanitizeValueForCSV(value) {
  if (isPlainObject(value) && value.filename && value.url) {
    return `"${value.url}"`
  }
  if (isArray(value)) {
    return value.map(sanitizeValueForCSV).join('; ')
  }
  if (value === undefined || value === null) return ''
  // if (isString(value) && value.match(/^0/) && !isNaN(value)) { // adds a leading # to number beginning with 0
  if (isString(value) && !isNaN(value)) {
    value = value.replace(/^(.{0})/, '$1#') // eslint-disable-line no-param-reassign
  }
  return value.toString().replace(/\n|,/g, ' ')
}
