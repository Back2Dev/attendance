// parse-module.js
//
// Parser for basic module file
//
const cc = require('change-case')

const debug = require('debug')('app:parser')

const when = new Date()
let errs = []
let section
const app = {
  current: {},
  parts: {},
  when,
}
//
// add singular/Plural forms of collection name to replacer object
const addLC = (obj, kvs) => {
  Object.keys(kvs).forEach((key) => {
    const value = kvs[key]
    obj[key] = value
    obj[`LC_${key}`] = value.toLowerCase()
    obj[`CC_${key}`] = camelCase(value)
    obj[`LC1_${key}`] = value.toLowerCase().replace(/s$/i, '')
    obj[`1_${key}`] = value.replace(/s$/i, '')
  })
  return obj
}

const parse = (data) => {
  errs = []
  console.log(data)
  if (!data.fields) {
    throw new Error('Missing fields definition')
  }
  if (typeof data.fields === 'string') {
    data.fields = data.fields.split(/[\t\;\,\s]+/).map((f) => {
      return { f: { type: String, optional: true } }
    })
  }

  return data
}

const fixSQLTypes = (schema, quote) => {
  const mappings = {
    'SimpleSchema.Integer': 'DataTypes.INTEGER',
    String: 'DataTypes.STRING',
    Number: 'DataTypes.FLOAT',
    Date: 'DataTypes.DATETIME',
  }
  const sql = {}
  Object.keys(schema)
    .filter((col) => !(col.match(/Id$/) || col.match(/At$/) || col === '_id'))
    .forEach((col) => {
      const wasType = schema[col].type || schema[col]
      if (quote)
        sql[col] = { type: mappings[wasType] ? `"${mappings[wasType]}"` : `"${wasType}"` }
      else sql[col] = { type: mappings[wasType] ? mappings[wasType] : wasType }
      if (col === 'id') sql[col].primaryKey = true
    })
  return sql
}

exports = exports || {}
exports.parse = parse
exports.fixSQLTypes = fixSQLTypes
