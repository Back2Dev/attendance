import moment from 'moment'
import numeral from 'numeral'
import React from 'react'

import ArrayFormater from './array'
import BooleanFormater from './boolean'

const debug = require('debug')('app:dba-formaters:index')

const DataFormatter = (props) => {
  debug('data formater props', props)
  const { column, row } = props
  const cellValue = column ? row[column.key] : undefined
  switch (column?.type) {
    case 'String':
      return cellValue || null
    case 'SimpleSchema.Integer':
    case 'Integer':
      return numeral(cellValue).format('0,0') || null
    case 'Number':
      return numeral(cellValue).format('0,0.00') || null
    case 'Date':
      return cellValue ? moment(cellValue).format('DD/MM/YYYY HH:mm') : null
    case 'Array':
      return <ArrayFormater {...props} />
    case 'Boolean':
      return <BooleanFormater {...props} />
    default:
      return cellValue ? JSON.stringify(cellValue, null, 2) : null
  }
}

export default DataFormatter
