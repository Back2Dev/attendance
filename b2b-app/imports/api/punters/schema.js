import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

import {
  OptionalRegExId,
  Blackbox,
  OptionalBlackbox,
  OptionalInteger,
  OptionalString,
  createdAt,
  updatedAt,
} from '/imports/api/utils/schema-util'

const Punters = new Mongo.Collection('punters')

export const PuntersSchema = new SimpleSchema({
  _id: OptionalRegExId,

  memberNo: String,
  name: String,
  directDebit: OptionalString,
  guestCard: OptionalString,
  pre79Card: OptionalString,
  carPass: OptionalString,
  subscription: OptionalString,
  payByInstalments: OptionalString,
  item1: OptionalString,
  item1Pmt: OptionalString,
  item2: OptionalString,
  item2Pmt: OptionalString,
  item3: OptionalString,
  item3Pmt: OptionalString,
  item4: OptionalString,
  item4Pmt: OptionalString,
  item5: OptionalString,
  item5Pmt: OptionalString,
  firstName: OptionalString,
  lastName: OptionalString,
  status: OptionalString,
  statusReason: OptionalString,
  createdAt,
  updatedAt,
})

Punters.attachSchema(PuntersSchema)

export default Punters
