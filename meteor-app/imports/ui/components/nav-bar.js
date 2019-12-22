import React from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { withRouter, NavLink } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { Roles } from 'meteor/alanning:roles'

import AdminMenu from '/imports/ui/pages/admin-menu'

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
const NavBar = ({ currentUser, location }) => {
  return (
    <Menu vertical attached="top" inverted size="large" color="black" className="tm-sidebar">
      <Menu.Item as={NavLink} activeClassName="" exact to="/" style={{ textAlign: 'center' }}>
        <img src="/images/b2b150.jpg" className="ui small image" />
      </Menu.Item>

      {Roles.userIsInRole(Meteor.userId(), 'signin') ? (
        <span>
          <Menu.Item
            as={NavLink}
            content="Vol sign in"
            icon="toggle on"
            activeClassName="active"
            exact
            to="/volsignin"
            key="volsignin"
          />
        </span>
      ) : (
        ''
      )}

      <Menu.Item as={NavLink} content="Shop" icon="shop" activeClassName="active" exact to="/shop" key="shop" />
      <Menu.Item as={NavLink} content="Register" icon="plus" activeClassName="active" exact to="/add" key="add" />

      {Roles.userIsInRole(Meteor.userId(), 'parts') ? (
        <Menu.Item
          as={NavLink}
          content="Parts"
          icon="configure"
          activeClassName="active"
          exact
          to="/parts"
          key="parts"
        />
      ) : (
        ''
      )}

      {Roles.userIsInRole(Meteor.userId(), 'paynow')
        ? [
            <Menu.Item
              as={NavLink}
              content="Pay now"
              icon="payment"
              activeClassName="active"
              exact
              to="/paynow"
              key="paynow"
            />
          ]
        : ''}
      {Roles.userIsInRole(Meteor.userId(), 'servicing')
        ? [
            <Menu.Item
              as={NavLink}
              content="New service"
              icon="lock open"
              activeClassName="active"
              exact
              to="/assessment"
              key="assessment"
            />,
            <Menu.Item
              as={NavLink}
              content="Current jobs"
              icon="list alternate outline"
              activeClassName="active"
              exact
              to="/jobs"
              key="jobs"
            />,
            <Menu.Item
              as={NavLink}
              content="Job history"
              icon="list alternate outline"
              activeClassName="active"
              exact
              to="/job-history"
              key="job-history"
            />
          ]
        : ''}
      {Roles.userIsInRole(Meteor.userId(), 'admin') ? <AdminMenu></AdminMenu> : ''}
      {Roles.userIsInRole(Meteor.userId(), 'superadmin')
        ? [
            <Menu.Item
              as={NavLink}
              content="Super admin"
              icon="user secret"
              activeClassName="active"
              exact
              to="/superadmin"
              key="superadmin"
            />
          ]
        : ''}
      {currentUser === '' ? (
        <Menu.Item as={NavLink} content="Login" icon="user" activeClassName="active" exact to="/login" key="login" />
      ) : (
        /* <Dropdown.Item icon="add user" text="Sign Up" as={NavLink} exact to="/signup" /> */
        <div>
          <Menu.Item as={NavLink} content="Sign Out" icon="sign out" activeClassName="active" exact to="/signout" />
          <Menu.Item content={currentUser} />
        </div>
      )}
    </Menu>
  )
}

/** Declare the types of all properties. */
NavBar.propTypes = {
  currentUser: PropTypes.string
}

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const NavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : ''
}))(NavBar)

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(NavBarContainer)
