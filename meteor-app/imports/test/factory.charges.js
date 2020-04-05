import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Charges from '/imports/api/charges/schema'

Factory.define('charges', Charges, {
  token: 'charge_token',
  success: 'true',
  amount: 15000,
  currency: 'AUD',
  description: 'Purchase',
  email: 'my-email-address@live.com.au',
  ip_address: '49.184.168.999',
  created_at: new Date(),
  status_message: 'Success',
  error_message: null,
  card: {
    token: 'card_token',
    scheme: 'visa',
    display_number: 'XXXX-XXXX-XXXX-9999',
    issuing_country: 'AU',
    expiry_month: 12,
    expiry_year: 2020,
    name: 'Card Holder',
    address_line1: '28 Wilson Avenue',
    address_line2: null,
    address_city: 'Westchester',
    address_postcode: '3032',
    address_state: 'VIC',
    address_country: 'Australia',
    customer_token: 'customer-token',
    primary: true
  },
  transfer: [],
  amount_refunded: 0,
  total_fees: 292,
  merchant_entitlement: '14708',
  refund_pending: false,
  authorisation_expired: false,
  captured: true,
  captured_at: '2019-12-10T18:37:55Z',
  settlement_currency: 'AUD',
  active_chargebacks: false,
  metadata: {
    cartid: 'q7bmgn9iryWMM8qNq',
    codes: 'PA-PASS-MULTI-10'
  },
  reconciled: false,
  matched: false
})
