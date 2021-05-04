import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  RegExId,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'
import CONSTANTS from '/imports/api/constants'
const Members = new Mongo.Collection('members')

export const AddBadgeParamsSchema = new SimpleSchema({
  memberId: RegExId,
  code: String,
})

export const BadgeItemSchema = new SimpleSchema({
  code: String,
  private: {
    type: Boolean,
    optional: true,
  },
  createdAt: Date,
})

export const MembersSchema = new SimpleSchema({
  _id: OptionalRegExId,
  userId: RegExId,
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
  badges: {
    type: Array,
    optional: true,
  },
  'badges.$': BadgeItemSchema,
  // Fields that were in the user record
  mobile: {
    type: String,
    optional: true,
  },
  phone: {
    type: String,
    optional: true,
  },
  bio: {
    type: String,
    optional: true,
  },
  favorites: {
    type: Array,
    optional: true,
  },
  'favorites.$': String,
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

Members.attachSchema(MembersSchema)

export default Members
