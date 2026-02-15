import React from 'react'

// Formatters suitable for use with React-tabulator

//

// How to use - imports
export const profitFormatter = (cell, formatterParams, onRendered) => {
  const colour = cell.getValue() > 0 ? 'green' : 'red'
  // const perc = cell.getValue() ? sprintf('%#,##0.1f', cell.getValue()) + '%' : ''
  const perc = cell.getValue()
    ? cell
        .getValue()
        .toFixed(1)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '%'
    : ''
  return `<span style="color:${colour}">${perc}</span>`
}

const dollars = (cents, decimals) => {
  if (cents)
    return `$${(cents / 100).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
  return ''
}

//
// How to use - imports
/* 
  import { centFormatter } from '/imports/ui/utils/formatters'
*/
// How to use - in the list of field definitions,
// pass in the formatter and formatterParams props
// - the sorter prop tells it that the field is numeric for sorting purposes
// formatterProps.colors defines colours for negative and positive numbers
/*
  {
    field: 'currentPrice',
    title: 'Current price',
    editor: true,
    sorter: 'number',
    formatter: centFormatter,
    formatterParams: { decimals: 2, colors: ["red","green"] }
  },
*/

export const centFormatter = (cell, formatterParams, onRendered) => {
  //cell - the cell component
  //formatterParams - parameters set for the column
  //onRendered - function to call when the formatter has been rendered
  const decimals = formatterParams.decimals ? formatterParams.decimals : 0
  const value = dollars(cell.getValue(), decimals)
  if (formatterParams.colors) {
    const colour =
      cell.getValue() > 0 ? formatterParams.colors[1] : formatterParams.colors[0]
    return `<span style="color:${colour}">${value}</span>`
  }
  return value
}

export const dateFormat = {
  inputFormat: 'DD/MM/YY hh:mm',
  outputFormat: 'DD/MM/YY h:mm A',
  invalidPlaceholder: 'Invalid Date',
}

export const expiryFormatter = (cell, formatterParams, onRendered) => {
  const expiry = `${cell._cell.row.data.card.expiry_month}/${
    cell._cell.row.data.card.expiry_year - 2000
  }`
  return `<span >${expiry}</span>`
}

export const objectFormatter = (cell) => {
  let r = ''
  const o = cell.getValue()
  if (o) {
    r = Object.keys(o)
      .map((k) => `${k}: ${o[k]}`)
      .join(', ')
  }
  return r
}

export const cardFormatter = (cell) => {
  return cell.getValue().replace(/XXXX-XXXX-XX/, '')
}

// Non-tabulator functions...
export const dollarFormatter = (n, decimals) => {
  if (isNaN(n)) return ''
  return dollars(Math.floor(n * 100), decimals)
}

// Non-tabulator function
export const numberFormatter = (n, decimals) => {
  if (isNaN(n)) return ''
  return dollars(Math.floor(n * 100), decimals).replace(/^\$/, '')
}
