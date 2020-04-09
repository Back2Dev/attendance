import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Parts from '/imports/api/parts/schema'

Factory.define('part', Parts, {
  imageUrl: '/public/images/logo-large.jpg',
  retailPrice: 6666, // This is in cents
  wholesalePrice: 3333,
  partNo: 'pt-123',
  name: 'carbonfibre frame',
  barcode: '22413000022413',
  status: CONSTANTS.PART_STATUS_NEW
})
