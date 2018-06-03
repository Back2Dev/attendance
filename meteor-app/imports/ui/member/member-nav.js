import React from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { Menu, Image, Button } from 'semantic-ui-react'
import Search from '/imports/ui/member/member-search'

const Nav = (props) => {

  return (
    <Menu fixed='top'>
      <Menu.Item onClick={() => { props.history.push('/') }}>
        <Image src='/images/logo-tiny.jpg' />
      </Menu.Item>
      <Menu.Item onClick={() => { props.history.push('/add') }}>
        <Button
          content='Add Volunteer'
          icon='add user'
        />
      </Menu.Item>
      <Menu.Item position='right' onClick={() => { props.history.push('/admin') }}>
        <Button
          content='Admin'
          icon='dashboard'
        />
      </Menu.Item>
    </Menu>
  )
}

Nav.propTypes = {
};

export default withRouter(Nav)