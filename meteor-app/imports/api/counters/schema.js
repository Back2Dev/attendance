import { Mongo } from 'meteor/mongo'
import SimpleSchema from  'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'
import CONSTANTS from '/imports/api/constants'

const Counters = new Mongo.Collection('counters')

// export const CountersSchema = new SimpleSchema({
//   _id: RegExId,
//   name: { type: String, label: 'Service description' },
//   price: { type: SimpleSchema.Integer, label: 'Price in cents' },
//   package: { type: String, label: 'Minor or major service', allowedValues: Object.keys(CONSTANTS.SERVICE_TYPES) },
//   code: { type: String, label: 'Front/Rear code', optional: true},
//   createdAt,
//   updatedAt,
// })

// Services.attachSchema(CountersSchema)

export default Counters
