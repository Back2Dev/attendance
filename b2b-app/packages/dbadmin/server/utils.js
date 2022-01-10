import moment from 'moment'
import numeral from 'numeral'
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
      return ({ row }) => row[columnName] || null
    case 'SimpleSchema.Integer':
    case 'Integer':
      return ({ row }) => numeral(row[columnName]).format('0,0') || null
    case 'Number':
      return ({ row }) => numeral(row[columnName]).format('0,0.00') || null
    case 'Date':
      return ({ row }) =>
        row[columnName] ? moment(row[columnName]).format('DD/MM/YYYY HH:mm') : null
    default:
      return ({ row }) =>
        row[columnName] ? JSON.stringify(row[columnName], null, 2) : null
  }
}

export const getComparator = ({ fieldType, fieldName, direction }) => {
  const dirFactor = direction === 'ASC' ? 1 : -1
  switch (fieldType) {
    case 'String':
      return (a, b) => {
        return a[fieldName]?.localeCompare(b[fieldName]) * dirFactor
      }
    case 'SimpleSchema.Integer':
    case 'Integer':
    case 'Number':
    case 'Date':
      return (a, b) => {
        return a[fieldName] > b[fieldName] ? 1 * dirFactor : -1 * dirFactor
      }
    default:
      return () => 0
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
