// exporter.js
import _ from 'lodash'
import { saveAs } from 'file-saver'
import { csvFileNameFor, sanitizeValueForCSV } from './csv'
const debug = require('debug')('tm:exporter')

export const exportData = function(rows, item, columns) {
  debug(`export ${item} data to CSV`, rows)
  const keys = ['Class', 'Student Login', 'Student Password']

  const cols = Object.keys(columns)
  const names = Object.values(columns)
  const values = _.chain(rows)
    // .map(c => [sanitizeValueForCSV(c.name), sanitizeValueForCSV(c.slug), sanitizeValueForCSV(c.password)])
    .map(c => cols.map(col => sanitizeValueForCSV(c[col])))
    .unshift(names)
    .join('\n')
    .value()

  const blob = new Blob([values], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, csvFileNameFor(`${item}`))
}
