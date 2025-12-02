import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'meteor/aldeed:simple-schema'

import {
  OptionalRegExId,
  RegExId,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'
import CONSTANTS from '/imports/api/constants'
const Members = new Mongo.Collection('members')

if (Meteor.isServer) {
  const ensureIndexes = async () => {
    const collection = Members.rawCollection()
    await collection.createIndex(
      {
        _id: 'text',
        name: 'text',
        email: 'text',
        mobile: 'text',
        emergencyContact: 'text',
      },
      {
        weights: {
          _id: 30,
          name: 15,
          email: 10,
          mobile: 8,
          emergencyContact: 5,
        },
        name: 'member_text_search',
      }
    )
    await collection.createIndex(
      {
        name: 1,
        email: 1,
        mobile: 1,
        address: 1,
      },
      { name: 'member_regex_search' }
    )
    await collection.createIndex({ name: 1 }, { name: 'member_name' })
    await collection.createIndex({ email: 1 }, { name: 'member_email' })
    await collection.createIndex({ mobile: 1 }, { name: 'member_mobile' })
    await collection.createIndex({ address: 1 }, { name: 'member_address' })
  }

  Meteor.startup(() => {
    ensureIndexes().catch((err) =>
      console.error('Error creating indexes for members', err)
    )
  })
}

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
  userId: OptionalRegExId,
  // Combine first and last name
  name: {
    type: String,
  },
  nickname: {
    type: String,
    optional: true,
    label: 'Nickname, ie what people call you',
  },
  email: {
    type: String,
    optional: true,
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
