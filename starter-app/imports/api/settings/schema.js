import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { OptionalRegExId, createdAt, updatedAt } from '/imports/api/utils/schema-util'

const Settings = new Mongo.Collection('settings')
if (Meteor.isServer) {
  Settings._ensureIndex(
    {
      key: 1,
    },
    { unique: true, name: 'key_unique' }
  )
}

export const SettingsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  name: String,
  key: String,
  value: String,
  public: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
  readonly: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
  createdAt,
  updatedAt,
})

Settings.attachSchema(SettingsSchema)

export default Settings
