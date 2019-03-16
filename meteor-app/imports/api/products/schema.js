import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'
import CONSTANTS from '../constants'

const Products = new Mongo.Collection('products')
export const ProductTypes = new Mongo.Collection('productTypes')

export const ProductTypesSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Product Type Name'
  },
  description: {
    type: String,
    label: 'Product Type Description'
  },
  type: {
    type: SimpleSchema.Integer,
    label: 'Product Type Code',
    allowedValues: Object.keys(CONSTANTS.PRODUCT_TYPES_READABLE).map(key => parseInt(key, 10))
  },
  color: {
    type: String,
    defaultValue: 'green'
  },
  image: {
    type: String,
    label: 'Product Type Image',
    optional: true
  },
  icon: {
    type: String,
    label: 'Product Type Icon',
    optional: true
  }
})

export const ProductsSchema = new SimpleSchema({
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
    label: 'Product Type: pass, membership, course',
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
ProductTypes.attachSchema(ProductTypesSchema)

export default Products
