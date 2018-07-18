import React from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { Divider, Image, Button } from 'semantic-ui-react'
import './navbar.css'

const NavBar = (props) => {

  return (
      <div className="menunavbar">
        <Image className="navbarlogo" src='/images/logo-large.jpg' onClick={() => { props.history.push('/')}} />
        <div className="menu-buttons"> 
        <Button
          className='navbutton'
          color='green'
          content='Home'
          icon='home'
          onClick={() => { props.history.push('/') }}
          />
     
          <Button
          className='navbutton'
          color='blue'
          content='Admin'
          icon='dashboard'
          onClick={() => { props.history.push('/admin') }}
        />
        </div>
     
    </div>

  )
}

NavBar.propTypes = {
};

export default withRouter(NavBar)