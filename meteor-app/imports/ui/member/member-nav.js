import React from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { Menu, Image, Button } from 'semantic-ui-react'
import Search from '/imports/ui/member/member-search-container'

const Nav = (props) => {

  return (
    <Menu fixed='top' stackable>
      <Menu.Item onClick={() => { props.history.push('/') }}>
        <Image src='/images/logo-tiny.jpg' />
      </Menu.Item>
      <Menu.Item onClick={() => { props.history.push('/add') }}>
        <Button
          color='green'
          content='Add Volunteer'
          icon='add user'
          />
          </Menu.Item>
          <Menu.Item onClick={() => { props.history.push('/admin') }}>
          <Button
          color='blue'
          content='Admin'
          icon='dashboard'
        />
      </Menu.Item>
      <Menu.Item position='right'>
      <Search />
      </Menu.Item>
    </Menu>
  )
}

Nav.propTypes = {
};

export default withRouter(Nav)