import { Match } from 'meteor/check'
import Settings from '../schema'
const debug = require('debug')('app:settings:helper')

/**
 * Remove Setting
 * @param {string} id
 * @param {boolean} incReadonly - Included readonly settings
 * @returns {object} result
 * - {string} result.status - the status success or failed
 * - {string} result.message
 * - {integer} result.removed - the the number of removed documents
 */
export const rmSettings = (id, incReadonly = false) => {
  if (!Match.test(id, String)) {
    return { status: 'failed', message: `Invalid id` }
  }

  const condition = {
    _id: id,
    readonly: false,
  }

  if (incReadonly === true) {
    delete condition.readonly
  }

  try {
    const n = Settings.remove(condition)
    return { status: 'success', message: `Removed setting`, removed: n }
  } catch (e) {
    return { status: 'failed', message: `Error removing setting: ${e.message}` }
  }
}

/**
 * update Setting
 * @param {object} form
 * @param {boolean} incReadonly - Included readonly settings
 * @returns {object} result
 * - {string} result.status - the status success or failed
 * - {string} result.message
 * - {integer} result.updated - the the number of updated documents
 */
export const updateSettings = (form, incReadonly = false) => {
  if (!Match.test(form, Match.ObjectIncluding({ _id: String }))) {
    return { status: 'failed', message: `Invalid form data` }
  }

  try {
    const { _id: id, ...data } = form

    const condition = {
      _id: id,
      readonly: false,
    }

    if (incReadonly === true) {
      delete condition.readonly
    }

    const n = Settings.update(condition, { $set: data })
    // debug('update', { condition }, { data }, { n })
    return { status: 'success', message: `Updated ${n} setting(s)`, updated: n }
  } catch (e) {
    return { status: 'failed', message: `Error updating setting: ${e.message}` }
  }
}

/**
 *
 * @param {object} form
 * @returns {object} result
 * - {string} result.status - the status success or failed
 * - {string} result.message
 */
export const insertSettings = (form) => {
  try {
    const id = Settings.insert(form)
    return { status: 'success', message: `Added setting`, id }
  } catch (e) {
    return { status: 'failed', message: `Error adding setting: ${e.message}` }
  }
}

/**
 * get single setting
 * @param {string} key
 * @param {any} defaultValue
 * @returns {object} of setting or null
 */
export const getSetting = ({ key, defaultValue }) => {
  // debug('get.setting key', key)
  if (!Match.test(key, String)) {
    return null
  }

  const result = Settings.findOne({ key })
  // debug('get.setting result', result)

  // we may want to handle the public/private flag here

  if (!result && defaultValue) {
    return {
      key,
      value: defaultValue,
    }
  }

  return result || null
}

/**
 * get settings
 * @param {string[]} keys
 * @returns {object} settings, with properties are setting keys or null
 */
export const getSettings = ({ keys }) => {
  // debug('get.settings keys', keys)
  if (!Match.test(keys, [String])) {
    return null
  }

  const settings = Settings.find({ key: { $in: keys } }).fetch() || []
  // debug('get.settings', settings)

  if (settings.length === 0) {
    return null
  }

  const result = {}
  settings.map((item) => {
    result[item.key] = item
  })

  return result
}

/**
 * get single setting value
 * @param {string} key
 * @param {any} defaultValue
 * @returns {string} of setting value or null
 */
export const getCfg = (key, defaultValue) => {
  // debug('get.setting key', key)
  if (!Match.test(key, String)) {
    return null
  }

  const result = Settings.findOne({ key })

  if (!result && defaultValue) {
    return defaultValue
  }

  return result ? result.value : null
}

/**
 * get multi setting values
 * @param {string[]} keys
 * @returns {object} settings, with properties are setting keys or null
 */
export const getCfgs = (keys) => {
  // debug('get.settings keys', keys)
  if (!Match.test(keys, [String])) {
    return null
  }

  const settings = Settings.find({ key: { $in: keys } }).fetch() || []
  // debug('get.settings', settings)

  if (settings.length === 0) {
    return null
  }

  const result = {}
  settings.map((item) => {
    result[item.key] = item.value
  })

  return result
}
