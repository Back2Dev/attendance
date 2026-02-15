import HMACSHA256 from 'crypto-js/hmac-sha256'
import Base64 from 'crypto-js/enc-base64'
import axios from 'axios'
const debug = require('debug')('app:header-fns')
//
// Header functions for API calls. Sometimes we need to provide a
// header value that is calculated, like a hmac.
//
let seq = 100

// Mike's test system
// const API_PRIVATE_KEY =
//   '0vsYgRhCTp4ekazBRB3aSWAQ2DFjJ8cGswuNlNTuWW0mgwKlCgu1l0ejgJQO5H8LUpC51xXg8waur6M0w=='
// const API_KEY = '8ca7b557-f42a-46d4-ba60-e7e46b64962b'

// DPA Production system
const API_PRIVATE_KEY =
  'jRiG3BOgIqy8km94P1pE9wBot3GvZSVYO35E01SpfQSDhEuL3jekO1tyApuF8bu9LnoW3V8teJ058nl1YkALQ=='
const API_KEY = 'b63e29b2-a132-4382-99f9-a7036defc58c'

const headerFns = {
  // Unleashed uses a private key to encrypt the parameters
  unleashed: (headers, args, privatekey) => {
    // debug('Unleashed header fn', { headers, args, privatekey })
    //CryptoJS is being used in javascript to generate the hash security keys
    // We need to pass the url parameters as well as the key to return a SHA256
    var hash = HMACSHA256(args, privatekey)
    // That hash generated has to be set into base64
    var hash64 = Base64.stringify(hash)
    // debug({ privatekey, hash64 })
    headers['api-auth-signature'] = hash64
  },
}
export default headerFns

// This function gets the next Customer Code, by querying the database to find the last one
const nextCC = async () => {
  const params = {
    CustomerCode: 'B2B',
    orderBy: 'CustomerCode',
    sort: 'asc',
    pageSize: '10', // Get a small amount of data, as we detect the number of pages
  }
  const headers = {
    'api-auth-id': API_KEY,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'client-type': 'b2d/forms',
    // Calculated
    'api-auth-signature': '', // You must send the method signature in this header.
  }
  try {
    const args = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&')
    let page = '1'
    headerFns.unleashed(headers, args, API_PRIVATE_KEY)
    let ret = await axios.get(
      `https://api.unleashedsoftware.com/Customers/${page}?${args}`,
      {
        headers,
      }
    )
    // More than one page ? Get the last one...
    if (ret.data.Pagination.NumberOfPages > 1) {
      page = ret.data.Pagination.NumberOfPages
      ret = await axios.get(
        `https://api.unleashedsoftware.com/Customers/${page}?${args}`,
        {
          headers,
        }
      )
    }
    if (ret.data.Items.length) {
      seq = parseInt(
        ret.data.Items[ret.data.Items.length - 1].CustomerCode.replace(
          params.CustomerCode,
          ''
        )
      )
      // debug(
      //   `Read last seqno ${seq} from ${
      //     ret.data.Items[ret.data.Items.length - 1].CustomerCode
      //   } args:${args}`
      // )
      // debug(ret.data)
    }
  } catch (e) {
    console.error(e)
  }
  seq = seq + 1
  return `${params.CustomerCode}${seq}`
}

const suffix = {
  'less-than-5': 'small (0-5)',
  'between-5-and-15': 'medium (5-15)',
  'more-than-15': 'commercial (15+)',
}

export const bodyFns = {
  // Function is async...
  unleashed: async ({ formData, body }) => {
    const delivery =
      formData.contact.deliveryMethod === 'pickup'
        ? 'Will pick up'
        : [
            'Delivery: Yes',
            'Forklift: ' + formData.contact.forklift,
            'Staffed: ' + formData.contact.staffing,
            formData.contact.delivery ? 'Instructions: ' + formData.contact.delivery : '',
          ].join(',\n')

    body.Addresses[0].DeliveryInstruction = delivery
    body.Addresses[0].AddressType = 'Postal'
    body.Addresses[0].AddressName = formData.b2b.company + ' Postal'
    body.Addresses[0].IsDefault = false
    // Was a delivery address specified
    if (body.Addresses[1]?.StreetAddress) {
      body.Addresses[1].AddressType = 'Shipping'
      body.Addresses[1].AddressName = formData.b2b.company + ' Postal'
      body.Addresses[1].IsDefault = false
      body.Addresses[0].DeliveryInstruction = ''
      body.Addresses[1].DeliveryInstruction = delivery
    } else body.Addresses.pop()
    if (body.CustomerType === 'installer')
      body.CustomerType = `Installer ${suffix[formData.b2b.staff]}`
    if (body.Website) {
      if (
        !body.Website.match(
          /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
        )
      ) {
        body.Website = 'https://' + body.Website
        if (
          !body.Website.match(
            /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
          )
        )
          body.Website = '' // Could not make it work
      }
    }

    body.Notes = formData.contact.accounts__lastname
      ? 'Accounts contact: ' +
        formData.contact.accounts__firstname +
        ' ' +
        formData.contact.accounts__lastname +
        ' ' +
        formData.contact.accounts__email +
        '\n'
      : ''
    body.Notes =
      body.Notes + 'DPA Contact: ' + formData.contact.DPAcontact + '\n' + delivery
    // Getting the next Customer Code is async...
    // body.CustomerCode = await nextCC()
    delete body.CustomerCode
    body.DiscountRate = 0.0
    body.PrintPackingSlipInsteadOfInvoice = false
    body.PrintInvoice = false
    body.StopCredit = false
    body.Obsolete = false
    body.TaxCode = ''
    body.TaxRate = null
    body.SalesPerson = null // Doesn't like a string

    return body
  },
}
