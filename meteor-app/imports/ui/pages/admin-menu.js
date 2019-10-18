import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom'
import { Menu, Icon, Loader } from 'semantic-ui-react'
import PropTypes from 'prop-types'
const debug = require('debug')('tm:year-dropdown')

const adminPages = [
  { name: '', display: 'Admin' },
  { name: 'userprofiles', display: 'Users' },
  { name: 'wwcc', display: 'WWCC' },
  { name: 'slsa', display: 'SLSA' },
  { name: 'duplicates', display: 'Duplicates' },
  { name: 'renewals', display: 'Renewals' },
  { name: 'matching', display: 'Matching' },
]

const adminMenu = ({ current, goHome, history }) => {

  const itemClick = name => {
    history.push(`/admin/${name}`)

  }
  return (
    <div style={{
      backgroundColor: '#222',
      padding: '0 0 1em'
    }}>
      <Menu.Item
        onClick={itemClick}
        style={{ backgroundColor: '#222' }}
        data-page={adminPages[0]}
        key="admin"
      >
        Admin
      <Icon name="cog" />
      </Menu.Item>
      <div style={{
        cursor: 'pointer',
        paddingLeft: '1.2em',
        fontSize: '.9em',
        backgroundColor: '#222'
      }}>
        {adminPages.map(page => {
          const active = false//!!current.match(new RegExp(`${page.name}$`, 'i'))
          return (
            <div
              style={{
                color: active ? 'white' : '#aaa',
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

adminMenu.propTypes = {
  current: PropTypes.string.isRequired,
  itemClick: PropTypes.func.isRequired,
}

export default withRouter(adminMenu)
