import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  RegExId,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'
import CONSTANTS from '/imports/api/constants'
const Profiles = new Mongo.Collection('profiles')

export const ProfilesSchema = new SimpleSchema({
  _id: OptionalRegExId,
  userId: RegExId,
  // Historical id's saved here for now
  profile_id: {
    type: SimpleSchema.Integer,
    optional: true, // set to optional for migrated users only
  },
  user_id: {
    type: SimpleSchema.Integer,
    label: 'FKEY to userLogins',
    optional: true, // set to optional for migrated users only
  },
  // Combine first and last name
  name: {
    type: String,
  },
  nickname: {
    type: String,
    optional: true,
    label: 'Nickname, ie what people call you',
  },
  address: {
    type: String,
    optional: true,
  },
  avatar: {
    label: 'URL of avatar file',
    type: String,
    optional: true,
  },
  // Fields that were in the user record
  mobile: {
    type: String,
    optional: true,
  },
  phone: {
    type: String,
    optional: true,
  },
  userToken: {
    type: String,
    optional: true,
  },
  notifyBy: {
    type: Array,
    optional: true,
  },
  'notifyBy.$': { type: String, allowedValues: ['EMAIL', 'SMS'] },
  serial: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: Object.keys(CONSTANTS.USER_STATUS),
    defaultValue: 'active',
  },
  onlineStatus: {
    type: Object,
    optional: true,
    blackbox: true,
  },

  createdAt,
  updatedAt,
})

Profiles.attachSchema(ProfilesSchema)

export default Profiles
