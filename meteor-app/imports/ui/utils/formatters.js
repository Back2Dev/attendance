import React from 'react'
import { Sparklines, SparklinesLine } from 'react-sparklines'

// Formatters suitable for use with React-tabulator

//

// How to use - imports
/* 
  import { reactFormatter } from 'react-tabulator'
  import { Spark} from '/imports/ui/utils/formatters'
*/
// How to use - in the list of field definitions,
// pass in the formatter.
// The <Spark> component assumes you have key/value pairs in a history object
//
/*
{
  field: 'history',
  title: 'History',
  formatter: reactFormatter(<Spark />)
},
*/

export const Spark = props => {
  const cellData = props.cell._cell.row.data.history
  const colour = props.cell._cell.row.data.profit > 0 ? 'green' : 'red'

  return (
    <Sparklines data={Object.values(cellData).reverse()}>
      <SparklinesLine color={colour} />
    </Sparklines>
  )
}

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

const dollars = (cents, decimals) => `$${(cents / 100).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`

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
    const colour = cell.getValue() > 0 ? formatterParams.colors[1] : formatterParams.colors[0]
    return `<span style="color:${colour}">${value}</span>`
  }
  return value
}
