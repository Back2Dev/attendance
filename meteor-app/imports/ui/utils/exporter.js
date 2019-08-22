// exporter.js
import { saveAs } from 'file-saver'
import { csvFileNameFor, sanitizeValueForCSV } from '/imports/api/utils'
const debug = require('debug')('tm:exporter')

export const exportData = function(rows, item, columns) {
  debug(`export ${item} data to CSV`, rows)
  const keys = ['Class', 'Student Login', 'Student Password']

  const values = _.chain(rows)
    .map(c => [sanitizeValueForCSV(c.name), sanitizeValueForCSV(c.slug), sanitizeValueForCSV(c.password)])
    .unshift(keys)
    .join('\n')
    .value()

  const blob = new Blob([values], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, csvFileNameFor(`${item}`))
}
