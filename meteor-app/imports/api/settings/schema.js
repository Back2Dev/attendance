import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import { OptionalRegExId, createdAt, updatedAt } from '/imports/api/schemas/schema-util'

const Settings = new Mongo.Collection('settings')

export const SettingsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  // Templated replacement...

  name: {
    type: String
    // optional: true
  },
  type: {
    type: String
    // optional: true
  },
  key: {
    type: String
    // optional: true
  },
  value: {
    type: String
    // optional: true
  },
  createdAt,
  updatedAt
})

Settings.attachSchema(SettingsSchema)

export default Settings

export const getSetting = (key, defaultValue) => {
  const setting = Settings.findOne({ key })
  if (setting) return setting.value
  return defaultValue
}
