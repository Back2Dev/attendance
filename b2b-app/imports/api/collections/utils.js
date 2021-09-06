import moment from 'moment'

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
