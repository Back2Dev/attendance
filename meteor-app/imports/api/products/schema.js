import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'
import CONSTANTS from '../constants'

const Products = new Mongo.Collection('products')

export const ProductsSchema = new SimpleSchema({
  _id: RegExId,
  name: {
    type: String,
    label: 'Product Name'
  },
  description: {
    type: String,
    label: 'Product Description'
  },
  type: {
    type: SimpleSchema.Integer,
    label: 'Product Type: Pass, Membership, Course',
    allowedValues: Object.keys(CONSTANTS.PRODUCT_TYPES_READABLE).map(key => parseInt(key, 10))
  },
  duration: {
    type: SimpleSchema.Integer,
    label: 'Product Duration in weeks (if applicable)',
    optional: true
  },
  price: {
    type: SimpleSchema.Integer,
    label: 'Product Price in cents.  If free please leave blank',
    optional: true,
    defaultValue: 0
  },
  image: {
    type: String,
    label: 'Product Image',
    optional: true
  },
  active: {
    type: Boolean,
    label: 'Is the product available'
  },
  startDate: {
    type: Date,
    label: 'Product start date',
    optional: true
  },
  endDate: {
    type: Date,
    label: 'Product end date',
    optional: true
  },
  createdAt,
  updatedAt
})

Products.attachSchema(ProductsSchema)

export default Products
