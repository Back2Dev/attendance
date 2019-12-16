import React from 'react'
import PropTypes from 'prop-types'
import { Button, Menu, Checkbox, Tab, Icon, Table } from 'semantic-ui-react'
import 'react-tabulator/lib/styles.css'
import 'react-tabulator/lib/css/tabulator.min.css'
import { ReactTabulator } from 'react-tabulator'
import './styles.css'
const debug = require('debug')('b2b:reminders')

const CartList = ({ carts, status, columns }) => {
  const [filters, setFilters] = React.useState(status ? { status } : {})
  const newCarts = carts.filter(cart => cart.status === status)
  const [rows, setRows] = React.useState(newCarts)

  React.useEffect(() => {
    setRows(newCarts)
  })

  return <ReactTabulator columns={columns} data={rows} />
}

const Matching = ({ members, carts, purchases, columns }) => {
  const panes = [
    {
      menuItem: 'Complete',
      render: () => (
        <Tab.Pane attached={false}>
          <CartList carts={carts} status="complete" columns={columns} />
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Ready',
      render: () => (
        <Tab.Pane attached={false}>
          <CartList carts={carts} status="ready" columns={columns} />
        </Tab.Pane>
      )
    }
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
