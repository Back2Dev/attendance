/**
 * schema-util.js
 * utilities & helpers for collection schemas
 *
 * NOTE: This is a copy of the file /imports/api/utils/schema-utils
 *  The difference is that it imports the NPM version of SimpleSchema
 *  and provides a JSONEdit field for OptionalBlackbox
 */

import SimpleSchema from 'simpl-schema' // Uses the npm module
import { ConnectedMonaField } from '/imports/ui/forms/fields/mona-field'

export const REGEX_ID =
  /^[1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz]{17}$/

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
  autoValue: createdAtAutoValue,
}

/**
 * updatedAt gets updated every time you update the doc
 */
export const updatedAt = {
  type: Date,
  autoValue() {
    return new Date()
  },
}

/**
 * updatedBy should get the userId of the user who updated the record
 */
export const updatedBy = {
  type: REGEX_ID,
  optional: true,
}

/**
 * validate that the current field's value is
 * equal to the value of another field.
 * use with the SimpleSchema .custom directive
 * @param {[String]} fieldNames   array of field names to check against
 */
export function mustEqualOneOf(fieldNames) {
  return function mustEqualOneOfClosure() {
    if (
      this.isSet &&
      !fieldNames.map((fieldName) => this.field(fieldName).value).includes(this.value)
    ) {
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
      if ((thing.operator === '$set' && thing.value === null) || thing.value === '')
        return 'required'
      if (thing.operator === '$unset') return 'required'
      if (thing.operator === '$rename') return 'required'
    }
  }
}

export const RegExId = {
  type: String,
  regEx: REGEX_ID,
}

export const OptionalRegExId = {
  type: String,
  regEx: REGEX_ID,
  optional: true,
}

export const OptionalString = {
  type: String,
  optional: true,
}

export const OptionalInteger = {
  type: SimpleSchema.Integer,
  optional: true,
}

export const OptionalNumber = {
  type: SimpleSchema.Integer,
  optional: true,
}

export const Blackbox = {
  type: Object,
  blackbox: true,
}

export const OptionalBlackbox = {
  type: Object,
  blackbox: true,
  optional: true,
  uniforms: { component: ConnectedMonaField, language: 'json' },
}

// It may be better to explicitly nominate a JSON field:
export const OptionalJSON = {
  type: Object,
  blackbox: true,
  optional: true,
  uniforms: { component: ConnectedMonaField, language: 'json' },
}

export const OptionalDate = {
  type: Date,
  optional: true,
}

export const OptionalArray = {
  type: Array,
  optional: true,
}

export const OptionalBoolean = {
  type: Boolean,
  optional: true,
}
