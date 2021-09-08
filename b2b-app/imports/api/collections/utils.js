import moment from 'moment'
const debug = require('debug')('app:collections-utils')

export const formatData = ({ data, type }) => {
  switch (type) {
    case 'String':
    case 'SimpleSchema.Integer':
    case 'Integer':
    case 'Number':
      return data
    case 'Date':
      return data ? moment(data).format('DD/MM/YYYY HH:mm') : null
    default:
      return data ? JSON.stringify(data, null, 2) : null
  }
}

export const getDataFormatter = ({ type, columnName }) => {
  switch (type) {
    case 'String':
    case 'SimpleSchema.Integer':
    case 'Integer':
    case 'Number':
      return ({ row }) => row[columnName] || null
    case 'Date':
      return ({ row }) =>
        row[columnName] ? moment(row[columnName]).format('DD/MM/YYYY HH:mm') : null
    default:
      return ({ row }) =>
        row[columnName] ? JSON.stringify(row[columnName], null, 2) : null
  }
}

export const getFieldConditionByFilter = ({ fieldName, schema, filter }) => {
  // debug({ fieldName, schema, filter })

  const fieldSchema = schema._schema[fieldName]
  if (!fieldSchema) {
    return null
  }
  const fieldType = getFieldType({ fieldSchema })
  if (!fieldType) {
    return null
  }
  let condition = {}
  switch (fieldType) {
    case 'String':
      condition[fieldName] = {
        $regex: filter,
        $options: 'i',
      }
      break
    case 'SimpleSchema.Integer':
    case 'Integer':
      condition[fieldName] = parseInt(filter, 10)
      break
    case 'Number':
      condition[fieldName] = parseFloat(filter)
      break
    default:
      condition = null
  }

  return condition
}

export const getFieldType = ({ fieldSchema }) => {
  if (typeof fieldSchema.type?.definitions?.[0]?.type === 'string') {
    return fieldSchema.type?.definitions?.[0]?.type
  }
  return fieldSchema.type?.definitions?.[0]?.type?.name
}
