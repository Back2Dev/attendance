import React from 'react'
import PropTypes from 'prop-types'
import { Button, Menu, Checkbox, Tab, Icon, Table } from 'semantic-ui-react'
import moment from 'moment'
import ReactDataGrid from 'react-data-grid'
import { Toolbar, Data } from "react-data-grid-addons"
import './styles.css'
const debug = require('debug')('b2b:reminders')


const FormatDate = ({ value }) => <div>{moment(value).format('YYYY-MM-DD hh:mm')}</div>
const selectors = Data.Selectors


const cols = [
  {
    name: 'Date',
    key: 'createdAt',
    formatter: FormatDate,
    sortable: true,
  },
  {
    name: 'Status',
    key: 'status',
    filterable: true,
    sortable: true,
  },
  {
    name: 'Name',
    key: 'customerName',
    filterable: true,
    sortable: true,
    editable: true,
  },
  {
    name: 'Email',
    filterable: true,
    sortable: true,
    key: 'email'
  },
  {
    name: 'Payment name',
    filterable: true,
    sortable: true,
    key: 'creditCard.name'
  },
  {
    name: 'payment address',
    filterable: true,
    sortable: true,
    key: 'creditCard.address_line1'
  },
  // {
  //   name: 'Actions',
  //   key: null,
  // },
]


const handleFilterChange = filter => filters => {
  const newFilters = { ...filters }
  if (filter.filterTerm) {
    newFilters[filter.column.key] = filter
  } else {
    delete newFilters[filter.column.key]
  }
  return newFilters
}

function getRows(rows, filters) {
  return selectors.getRows({ rows, filters })
}


const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
  const comparer = (a, b) => {
    if (sortDirection === "ASC") {
      return a[sortColumn] > b[sortColumn] ? 1 : -1
    } else if (sortDirection === "DESC") {
      return a[sortColumn] < b[sortColumn] ? 1 : -1
    }
  }
  return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer)
}

const getter = document.get = (key) => {
  let splittedKey = key.split(".")

  if (document && key.includes('.')) {
    let current = document

    splittedKey.forEach((splitKey) => {
      if (current) {
        current = current[splitKey]
      }
    })

    return current
  } else {
    return document[key]
  }
}


const CartList = ({ carts, status }) => {

  const [rows, setRows] = React.useState(carts)
  const [filters, setFilters] = React.useState(status ? { status } : {})
  const filteredRows = getRows(rows, filters)

  const rowGetter = (rowIdx) => {
    let row = Object.assign({}, filteredRows[rowIdx])

    row.get = key => {
      let splitKey = key.split(".")

      if (key.includes('.')) {
        return row[splitKey[0]] ? row[splitKey[0]][splitKey[1]] : ""
      } else {
        return row[key]
      }
    }

    return row
  }

  return (
    <ReactDataGrid
      columns={cols}
      rowGetter={rowGetter}
      rowsCount={50}
      minHeight={450}
      onGridSort={(sortColumn, sortDirection) =>
        setRows(sortRows(carts, sortColumn, sortDirection))
      }
      toolbar={<Toolbar enableFilter={true} />}
      onAddFilter={filter => setFilters(handleFilterChange(filter))}
      onClearFilters={() => setFilters({})}

    />
  )

}

const Matching = ({ members, carts, purchases }) => {
  const panes = [
    {
      menuItem: 'Complete',
      render: () => (
        <Tab.Pane attached={false}>
          <CartList carts={carts} status="complete" />
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Ready',
      render: () => (
        <Tab.Pane attached={false}>
          <CartList carts={carts} status="ready" />
        </Tab.Pane>
      )
    },
  ]

  return (
    <div>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </div>
  )
}
export default Matching

Matching.propTypes = {
  members: PropTypes.array.isRequired,
  carts: PropTypes.array.isRequired,
  purchases: PropTypes.array.isRequired
}
