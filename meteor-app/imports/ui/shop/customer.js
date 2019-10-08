import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Icon, Menu, Label } from 'semantic-ui-react'

const CustomerMenuItem = props => {
  if (sessionStorage.getItem('name')) {
    return (
      <Menu.Item position="right" color="teal">
        <Icon name="user" /> {sessionStorage.getItem('name')}
      </Menu.Item>
    )
  }

  return null
}

export default CustomerMenuItem

export const CustomerLabel = ({ name }) => {
  if (name) {
    return (
      <Label basic pointing="right">
        <Icon name="user" /> {name}
      </Label>
    )
  }

  return null
}
