import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import { OptionalRegExId, OptionalString, OptionalInteger, createdAt, updatedAt } from '/imports/api/schema'
import CONSTANTS from '../constants'

const Products = new Mongo.Collection('products')
export const ProductTypes = new Mongo.Collection('productTypes')
export const Carts = new Mongo.Collection('carts')

export const ProductTypesSchema = new SimpleSchema({
  _id: OptionalRegExId,
  name: {
    type: String,
    label: 'Product Type Name'
  },
  description: {
    type: String,
    label: 'Product Type Description'
  },
  type: {
    type: String,
    label: 'Product Type Code',
    allowedValues: Object.keys(CONSTANTS.PRODUCT_TYPES_READABLE)
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
  _id: OptionalRegExId,
  name: {
    type: String,
    label: 'Product Name'
  },
  description: {
    type: String,
    label: 'Product Description'
  },
  code: {
    type: String,
    label: 'Product code'
  },
  type: {
    type: String,
    label: 'Product Type: pass, membership, course',
    allowedValues: Object.keys(CONSTANTS.PRODUCT_TYPES_READABLE)
  },
  duration: {
    type: SimpleSchema.Integer,
    label: 'Product Duration in months',
    optional: true
  },
  price: {
    type: SimpleSchema.Integer,
    label: 'Product Price in cents.  If free please leave blank',
    optional: true,
    defaultValue: 0
  },
  qty: {
    type: SimpleSchema.Integer,
    label: 'Quantity',
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
  autoRenew: {
    type: Boolean,
    label: 'Does it automatically get renewed'
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

const ProductListSchema = ProductsSchema.omit('createdAt', 'updatedAt')

export const CreditCardSchema = new SimpleSchema({
  email: { type: String, optional: true },
  address_line1: { type: String, optional: true },
  address_line2: {
    type: String,
    optional: true
  },
  address_city: { type: String, optional: true },
  address_postcode: { type: String, optional: true },
  address_state: { type: String, optional: true },
  address_country: { type: String, optional: true },
  card_token: { type: String, optional: true }
})

export const CardResponseSchema = new SimpleSchema({
  token: OptionalString,
  scheme: OptionalString,
  display_number: OptionalString,
  issuing_country: OptionalString,
  expiry_month: OptionalInteger,
  expiry_year: OptionalInteger,
  name: OptionalString,
  address_line1: OptionalString,
  address_line2: OptionalString,
  address_city: OptionalString,
  address_postcode: OptionalString,
  address_state: OptionalString,
  address_country: OptionalString,
  customer_token: OptionalString,
  primary: { type: Boolean, optional: true }
})

export const PaymentResponseSchema = new SimpleSchema({
  status: OptionalString,
  statusText: OptionalString,
  customerToken: OptionalString,
  email: OptionalString,
  created_at: OptionalString,
  card: { type: CardResponseSchema, optional: true }
})

export const CartsSchema = new SimpleSchema({
  _id: OptionalRegExId,
  memberId: OptionalRegExId,
  userId: OptionalRegExId,
  price: {
    type: SimpleSchema.Integer,
    label: 'Total Price in cents',
    defaultValue: 0
  },
  totalqty: {
    type: SimpleSchema.Integer,
    label: 'Total quantity',
    defaultValue: 0
  },
  prodqty: {
    type: Object,
    label: 'Product quantities',
    blackbox: true
  },
  products: {
    type: Array,
    optional: true
  },
  'products.$': ProductListSchema,
  creditCard: {
    type: CreditCardSchema,
    optional: true
  },
  customerResponse: { type: Object, blackbox: true, optional: true },
  chargeResponse: { type: Object, blackbox: true, optional: true },
  createdAt,
  updatedAt
})

Products.attachSchema(ProductsSchema)
ProductTypes.attachSchema(ProductTypesSchema)
Carts.attachSchema(CartsSchema)

Carts.allow({
  update() {
    return true
  },
  insert() {
    return true
  },
  remove() {
    return true
  }
})

export default Products
