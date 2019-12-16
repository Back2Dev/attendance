import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom'
import { Menu, Icon, Loader } from 'semantic-ui-react'
import PropTypes from 'prop-types'
const debug = require('debug')('tm:year-dropdown')

const adminPages = [
  { name: '', display: 'Admin' },
  { name: 'duplicates', display: 'Duplicates' },
  { name: 'events', display: 'Events' },
  { name: 'parts', display: 'Parts' },
  { name: 'products', display: 'Products' },
  { name: 'promos', display: 'Promos' },
  { name: 'renewals', display: 'Renewals' },
  { name: 'service-items', display: 'Service items' },
  { name: 'sessions', display: 'Sessions' },
  { name: 'matching', display: 'Shopping carts' },
  { name: 'slsa', display: 'SLSA' },
  { name: 'userprofiles', display: 'Users' },
  { name: 'wwcc', display: 'WWCC' }
]

const AdminMenu = ({ current, history }) => {
  const itemClick = name => {
    history.push(`/admin/${name}`)
  }
  return (
    <div
      style={{
        backgroundColor: '#222',
        padding: '0 0 1em'
      }}
    >
      <Menu.Item onClick={itemClick} style={{ backgroundColor: '#222' }} data-page={adminPages[0]} key="admin">
        Admin
        <Icon name="cog" />
      </Menu.Item>
      <div
        style={{
          cursor: 'pointer',
          paddingLeft: '1.2em',
          fontSize: '.9em',
          backgroundColor: '#222'
        }}
      >
        {adminPages.map(page => {
          const active = false //!!current.match(new RegExp(`${page.name}$`, 'i'))
          return (
            <div
              style={{
                color: active ? 'white' : '#aaa'
              }}
              key={page.name}
              data-page={page.name}
              onClick={() => itemClick(page.name)}
            >
              {page.display}
            </div>
          )
        })}
      </div>
    </div>
  )
}

AdminMenu.propTypes = {
  current: PropTypes.string.isRequired,
  itemClick: PropTypes.func.isRequired
}

export default withRouter(AdminMenu)
