import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'

const Members = new Mongo.Collection('members')

export const MembersSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: REGEX_ID,
    label: "Unique _id",
    optional: false
  },
  name: {
    type: String,
    label: "Name",
    max: 128,
  },
  email: {
    type: String,
    label: "Email Address",
    optional: true,
  },
  addressStreet: {
    type: String,
    label: "Street address",
    optional: true,
  },
  addressSuburb: {
    type: String,
    label: "Suburb",
    optional: true,
  },
  addressState: {
    type: String,
    label: "State",
    optional: true,
  },
  addressPostcode: {
    type: String,
    label: "Postcode",
    optional: true,
  },
  phone: {
    type: String,
    label: "Phone number",
    optional: true,
  },
  mobile: {
    type: String,
    label: "Mobile number",
    optional: true,
  },
  avatar: {
    type: String,
    label: "Avatar file name",
    defaultValue: "default.jpg",
  },
  isHere: {
    type: Boolean,
    label: "Is signed in",
    defaultValue: false,
  },
  isSuper: {
    type: Boolean,
    label: "Is supervisor",
    defaultValue: false,
  },
  joined: {
    type: Date,
    label: "Date added to database",
    defaultValue: new Date(),
  },
  lastIn: {
    type: Date,
    label: "Date of last interaction",
    defaultValue: new Date(),
  },
  sessions: {
    type: Array,
    label: "Array of sessions attended",
    defaultValue: [],
    blackbox: true,
  },
  'sessions.$': Object,
  sessionCount: {
    type: Number,
    defaultValue: 0,
  },
  bikesHousehold: {
    type: Number,
    label: "Number of bikes in household",
    optional: true,
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
    label: "Primary Bike",
    optional: true,
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
    label: "Work status",
    optional: true,
  },
  reasons: {
    type: String,
    label: "Reasons for volunteering",
    optional: true,
  },
  emergencyContact: {
    type: String,
    label: "Emergency contact name",
    optional: true,
  },
  emergencyEmail: {
    type: String,
    label: "Emergency contact email address",
    optional: true,
  },
  emergencyPhone: {
    type: String,
    label: "Emergency contact phone",
    optional: true,
  },
  emergencyMobile: {
    type: String,
    label: "Emergency contact mobile",
    optional: true,
  },
  pin: {
    type: String,
    label: "Pin number",
    optional: true,
  },
  createdAt,
  updatedAt,
})
Members.attachSchema(MembersSchema)

export default Members
