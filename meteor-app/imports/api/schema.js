//schema.js
export const REGEX_ID = /^[01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz]{17}$/;

/**
 * util-schema.js
 * utilities & helpers for collection schemas
 */


/**
 * createdAt timestamp gets set on insert
 * and can't be updated afterwards
 */

export function createdAtAutoValue() {
  if (this.isInsert) {
    return new Date();
  } else if (this.isUpsert) {
    return { $setOnInsert: new Date() };
  }
  this.unset();
  return undefined;
}

export const createdAt = {
  type: Date,
  autoValue: createdAtAutoValue,
};

/**
 * updatedAt timestamp can't be set on insert
 * and gets updated every time you update the doc
 */
export const updatedAt = {
  type: Date,
  autoValue() {
    if (this.isInsert) {
      this.unset();
      return undefined;
    }
    return {
      $set: new Date(),
    };
  },
  optional: true,
};


/**
 * validate that the current field's value is
 * equal to the value of another field.
 * use with the simpleschema .custom directive
 * @param {[String]} fieldNames   array of field names to check against
 */
export function mustEqualOneOf(fieldNames) {
  return function mustEqualOneOfClosure() {
    if (this.isSet && !fieldNames.map(fieldName => this.field(fieldName).value).includes(this.value)) {
      return 'mustEqualOneOf';
    }
    return true;
  };
};

 // This helper method does the ceremony around SimpleSchema's requirements

export const isRequired = (thing,shouldBeRequired) => {
  if (shouldBeRequired) {
    // inserts
    if (!thing.operator) {
      if (!thing.isSet || thing.value === null || thing.value === "") return "required";
    }

    // updates
    else if (thing.isSet) {
      if (thing.operator === "$set" && thing.value === null || thing.value === "") return "required";
      if (thing.operator === "$unset") return "required";
      if (thing.operator === "$rename") return "required";
    }
  }
};

//
// Generic function to fix createdAt and updatedAt values
//
export const fixCreatedAt = (collection) => {
  const yesterYear = new Date('2010-10-10');     // A known date and time that should not happen, as it predates the existence of Mentorloop the app

// Fill in missing createdAt values

  let query = { createdAt: { $exists: false } };
  let n = collection.update(query, { $set: { createdAt: yesterYear } }, { multi: true, bypassCollection2: true } );

// Fill in missing updatedAt values with the createdAt value

  query = { updatedAt: { $exists: false } };
  collection.find(query).forEach(record => {
    n = n + collection.update(record._id, { $set: { updatedAt: new Date(record.createdAt) } }, { bypassCollection2: true } );
  });

// Convert numbers to dates on createdAt

  query = { createdAt: { $gt: 0 } };
  collection.find(query).forEach(record => {
    n = n + collection.update(record._id, { $set: { createdAt: new Date(record.createdAt) } }, { bypassCollection2: true } );
  });

// Convert numbers to dates on createdAt

  query = { updatedAt: { $gt: 0 } };
  collection.find(query).forEach(record => {
    n = n + collection.update(record._id, { $set: { updatedAt: new Date(record.updatedAt) } }, { bypassCollection2: true } );
  });

// The number returned will probably be more than the number of records in the collection

  return n;
};

export const IntercomTimestamp = {
  type: Number,
};

export const RegExId = {
  type: String,
  regEx: REGEX_ID,
};

export const OptionalRegExId = {
  type: String,
  regEx: REGEX_ID,
  optional: true,
};

export const OptionalString = {
  type: String,
  optional: true,
};

