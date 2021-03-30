import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { REGEX_ID, createdAt, updatedAt, OptionalRegExId } from '/imports/api/schema'
import { SessionsSchema } from '/imports/api/sessions/schema'

const SessionListSchema = SessionsSchema.omit('memberId', 'createdAt', 'updatedAt')

const Members = new Mongo.Collection('members')

export const MembersSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: REGEX_ID,
    label: 'Unique _id',
    optional: false
  },
  userId: OptionalRegExId,
  name: {
    type: String,
    label: 'Name',
    max: 128
  },
  email: {
    type: String,
    label: 'Email Address',
    optional: true
  },
  addressStreet: {
    type: String,
    label: 'Street address',
    optional: true
  },
  addressStreet2: {
    type: String,
    label: 'Street address 2',
    optional: true
  },
  addressSuburb: {
    type: String,
    label: 'Suburb',
    optional: true
  },
  addressState: {
    type: String,
    label: 'State',
    optional: true
  },
  addressPostcode: {
    type: String,
    label: 'Postcode',
    optional: true
  },
  addressCountry: {
    type: String,
    label: 'Country',
    optional: true
  },
  phone: {
    type: String,
    label: 'Phone number',
    optional: true
  },
  mobile: {
    type: String,
    label: 'Mobile number',
    optional: true
  },
  avatar: {
    type: String,
    label: 'Avatar file name',
    defaultValue: 'default.jpg'
  },
  isHere: {
    type: Boolean,
    label: 'Is signed in',
    defaultValue: false
  },
  isSuper: {
    type: Boolean,
    label: 'Is supervisor',
    defaultValue: false
  },
  joined: {
    type: Date,
    label: 'Date added to database',
    defaultValue: new Date()
  },
  lastIn: {
    type: Date,
    label: 'Date of last interaction',
    defaultValue: new Date()
  },
  sessions: {
    type: Array,
    label: 'Array of sessions attended',
    defaultValue: [],
    blackbox: true
  },
  'sessions.$': SessionListSchema,
  sessionCount: {
    type: Number,
    defaultValue: 0
  },
  bikesHousehold: {
    type: Number,
    label: 'Number of bikes in household',
    optional: true
  },
  primaryBike: {
    type: String,
    // allowedValues: [
    //   "Road/racer",
    //   "Hybrid",
    //   "Mountain",
    //   "Cruiser",
    //   "Ladies",
    //   "Gents",
    //   "Fixie/Single Speed"
    // ],
    label: 'Primary Bike',
    optional: true
  },
  workStatus: {
    type: String,
    // allowedValues: [
    //   "Full Time",
    //   "Part Time",
    //   "Pension/Disability",
    //   "Unemployed",
    //   "Student",
    //   "Retired"
    // ],
    label: 'Work status',
    optional: true
  },
  reasons: {
    type: String,
    label: 'Reasons for volunteering',
    optional: true
  },
  emergencyContact: {
    type: String,
    label: 'Emergency contact name',
    optional: true
  },
  emergencyEmail: {
    type: String,
    label: 'Emergency contact email address',
    optional: true
  },
  emergencyPhone: {
    type: String,
    label: 'Emergency contact phone',
    optional: true
  },
  emergencyMobile: {
    type: String,
    label: 'Emergency contact mobile',
    optional: true
  },
  pin: {
    type: String,
    label: 'Pin number',
    optional: true
  },
  active: {
    type: Boolean,
    label: 'Is active',
    defaultValue: true,
    optional: true
  },

  //
  // Payment system attributes
  //
  paymentCustId: {
    type: String,
    label: 'Payment cust Id associated with customer',
    optional: true
  },
  autoPay: {
    type: Boolean,
    optional: true
  },
  cardToken: {
    type: String,
    label: 'Card token given to us from payments system',
    optional: true
  },
  cardBrand: {
    type: String,
    label: 'Card brand on file for user',
    optional: true
  },
  cardExpMonth: {
    type: Number,
    label: 'Card expiry month',
    optional: true
  },
  cardExpYear: {
    type: Number,
    label: 'Card expiry year',
    optional: true
  },
  cardDisplay: {
    type: String,
    label: 'Card display (only shows last 4 digits)',
    optional: true
  },
  cardCountry: {
    type: String,
    label: 'Country of issue',
    optional: true
  },
  status: {
    type: String,
    optional: true
  },
  expiry: {
    type: Date,
    optional: true
  },
  subsType: { type: String, optional: true },
  remaining: { type: SimpleSchema.Integer, optional: true },
  wwcc: {
    type: String,
    label: 'Working With Children Check (WWCC) number',
    optional: true
  },
  wwccOk: {
    type: Boolean,
    label: '(WWCC) checked ok',
    defaultValue: false,
    optional: true
  },
  wwccExpiry: {
    type: Date,
    label: '(WWCC) expiry date',
    optional: true
  },
  wwccError: {
    type: String,
    label: '(WWCC) error message',
    optional: true
  },
  wwccSurname: {
    type: String,
    label: '(WWCC) surname',
    optional: true
  },
  isSlsa: {
    type: Boolean,
    label: 'is a Surf Life Saver',
    defaultValue: false,
    optional: true
  },
  slsaId: {
    type: String,
    optional: true
  },
  privacy: {
    type: Boolean,
    label: 'I consent to storing my information',
    optional: true
  },
  terms: {
    type: Boolean,
    label: 'I have read and agree with the Terms & Conditions',
    optional: true
  },
  permission: {
    type: Boolean,
    label: 'I consent to take and use photos for publicity',
    optional: true
  },
  sports: {
    type: Array,
    label: 'Sports participation',
    defaultValue: []
  },
  'sports.$': String,
  swim: {
    type: Boolean,
    label: 'I can swim 200 metres unassisted',
    optional: true
  },
  fitness: {
    type: Boolean,
    label: 'I declare I am medically fit and capable of undertaking this physical activity',
    optional: true
  },
  parental: {
    type: Boolean,
    label: "Parental consent for U18's",
    optional: true
  },
  //
  // End of payment system data
  //
  paymentEmails: {
    type: Array,
    label: 'Array of payment emails',
    defaultValue: []
  },
  'paymentEmails.$': String,
  createdAt,
  updatedAt
})
Members.attachSchema(MembersSchema)

export default Members

//
// Pin Payments card data field mapping
//
export const pinCardFieldMap = {
  customer_token: 'paymentCustId',
  card_token: 'cardToken',
  scheme: 'cardBrand',
  expiry_month: 'cardExpMonth',
  expiry_year: 'cardExpYear',
  display_number: 'cardDisplay',
  issuing_country: 'cardCountry',
  expiry_month: 'cardExpMonth',
  expiry_year: 'cardExpYear'
}

export const pinAddressFieldMap = {
  email: 'email',
  address_line1: 'addressStreet',
  address_line2: 'addressStreet2',
  address_city: 'addressSuburb',
  address_postcode: 'addressPostcode',
  address_state: 'addressState',
  address_country: 'addressCountry'
}

export const Dupes = new Mongo.Collection('dupes')
export const RawDupes = new Mongo.Collection('rawdupes')
