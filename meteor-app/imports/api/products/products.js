import { Mongo } from 'meteor/mongo';
import SimpleSchema from  'simpl-schema'

import { REGEX_ID, createdAt, updatedAt } from '/imports/api/schema'

const Products = new Mongo.Collection('sessions')

export const ProductsSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: REGEX_ID,
    label: "Unique _id",
    optional: false
  },
  productTitle: {
    type: String,
    label: "Product Title"
  },
  productDescription: {
    type: String,
    label: "Product Description"
  },
  productType: {
    type: String,
    label: "Product Type: Pass, Membership, Course",
  },
  duration: {
    type: Number,
    label: "Product Duration in weeks (if applicable)",
    optional: true
  },
  price: {
    type: Number,
    label: "Product Price.  If free please leave blank",
    optional: true
  },
  image: {
    type: String,
    label: "Product Image",
    optional: true
  },
  active: {
    type: Boolean,
    label: "Is the product available",
  },
  startDate: {
    type: Date,
    label: "Product start date",
    optional: true
  },
  endDate: {
    type: Date,
    label: "Product end date",
    optional: true
  },
  createdAt,
  updatedAt,
})

Products.attachSchema(ProductsSchema)

export default Products
