import moment from 'moment'
import numeral from 'numeral'
import React from 'react'

import ArrayFormater from './array'

const DataFormatter = (props) => {
  console.log('data formater props', props)
  const { column, row } = props
  const cellValue = column ? row[column.key] : undefined
  switch (column?.type) {
    case 'String':
      return cellValue
    case 'SimpleSchema.Integer':
    case 'Integer':
      return numeral(cellValue).format('0,0') || null
    case 'Number':
      return numeral(cellValue).format('0,0.00') || null
    case 'Date':
      return cellValue ? moment(cellValue).format('DD/MM/YYYY HH:mm') : null
    case 'Array':
      return <ArrayFormater {...props} />
    default:
      return cellValue ? JSON.stringify(cellValue, null, 2) : null
  }
}

export default DataFormatter
