import axios from 'axios'

import { getCfg } from '/imports/api/settings/server/helper.js'

const debug = require('debug')('app:utils:address')

/**
 * Get address object from string address
 * @param {string} address
 * @returns {Object} result
 * @returns {string} result.status - success or failed
 * @returns {string} result.message
 * @returns {Object} result.data - https://developers.google.com/maps/documentation/geocoding/overview#results
 * @returns {Object} result.data.address_components
 * @returns {string} result.data.formatted_address
 * @returns {Object} result.data.geometry
 * @returns {string} result.data.place_id
 * @returns {string[]} result.data.types
 */
export const getAddressObject = async (address) => {
  const apiKey = getCfg('geocoding_api_key')
  if (!apiKey) {
    return {
      status: 'failed',
      message: 'api key was not found',
    }
  }
  if (!address || typeof address !== 'string') {
    return {
      status: 'failed',
      message: 'invalid address',
    }
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
  // debug(url)

  try {
    const { data } = await axios.get(url, {
      responseType: 'json',
    })
    // debug(data)
    if (!data || data.status !== 'OK') {
      return {
        status: 'failed',
        message: 'Invalid data response',
      }
    }

    return {
      status: 'success',
      data: data.results[0],
    }
  } catch (e) {
    return {
      status: 'failed',
      message: e.message,
    }
  }
}
