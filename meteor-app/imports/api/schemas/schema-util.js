/**
 * schema-util.js
 * utilities & helpers for collection schemas
 */

/**
 * createdAt timestamp gets set on insert
 * and can't be updated afterwards
 */

import SimpleSchema from 'simpl-schema'

export const REGEX_ID = /^[1234567890ABCDEFGHIJKLMNOPQRSTWXYZabcdefghijklmnopqrstuvwxyz]{17}$/

export function createdAtAutoValue() {
  if (this.isInsert) {
    return new Date()
  } else if (this.isUpsert) {
    return { $setOnInsert: new Date() }
  }
  this.unset()
  return undefined
}

export const createdAt = {
  type: Date,
  autoValue: createdAtAutoValue
}

/**
 * updatedAt gets updated every time you update the doc
 */
export const updatedAt = {
  type: Date,
  autoValue() {
    return new Date()
  }
}

/**
 * validate that the current field's value is
 * equal to the value of another field.
 * use with the simpleschema .custom directive
 * @param {[String]} fieldNames   array of field names to check against
 */
export function mustEqualOneOf(fieldNames) {
  return function mustEqualOneOfClosure() {
    if (this.isSet && !fieldNames.map(fieldName => this.field(fieldName).value).includes(this.value)) {
      return 'mustEqualOneOf'
    }
    return true
  }
}

// This helper method does the ceremony around SimpleSchema's requirements

export const isRequired = (thing, shouldBeRequired) => {
  if (shouldBeRequired) {
    // inserts
    if (!thing.operator) {
      if (!thing.isSet || thing.value === null || thing.value === '') return 'required'
    }

    // updates
    else if (thing.isSet) {
      if ((thing.operator === '$set' && thing.value === null) || thing.value === '') return 'required'
      if (thing.operator === '$unset') return 'required'
      if (thing.operator === '$rename') return 'required'
    }
  }
}

export const RegExId = {
  type: String,
  regEx: REGEX_ID
}

export const OptionalRegExId = {
  type: String,
  regEx: REGEX_ID,
  optional: true
}

export const OptionalString = {
  type: String,
  optional: true
}

export const OptionalInteger = {
  type: SimpleSchema.Integer,
  optional: true
}
