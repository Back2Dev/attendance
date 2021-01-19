import React from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { withRouter, NavLink } from 'react-router-dom'
import { Menu, Loader } from 'semantic-ui-react'
import { Roles } from 'meteor/alanning:roles'
import Members from '/imports/api/members/schema'
import { version } from '/imports/api/version'
import AdminMenu from '/imports/ui/pages/admin-menu'

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
const NavBar = ({ currentUser, currentMember, location, loading }) => {
  const id = currentMember ? currentMember._id : ''
  if (loading) {
    return <Loader active />
  }
  return (
    <Menu
      vertical
      attached="top"
      inverted
      size="large"
      color="black"
      className="tm-sidebar"
      style={{ background: Meteor.settings.public.background }}
    >
      <Menu.Item as={NavLink} activeClassName="" exact to="/" style={{ textAlign: 'center' }}>
        <img src={Meteor.settings.public.logo} title={version()} className="ui center aligned container small image" />
      </Menu.Item>

      {currentUser === '' ? (
        <div>
          <Menu.Item as={NavLink} content="Login" icon="user" activeClassName="active" exact to="/login" key="login" />
        </div>
      ) : (
        /* <Dropdown.Item icon="add user" text="Sign up" as={NavLink} exact to="/signup" /> */
        <div>
          <Menu.Item
            as={NavLink}
            content="Home"
            icon="user"
            activeClassName="active"
            exact
            to="/member-portal"
            key="member-portal"
          />
        </div>
      )}
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

      {(Roles.userIsInRole(Meteor.userId(), 'shop') || !currentUser) && (
        <Menu.Item as={NavLink} content="Shop" icon="shop" activeClassName="active" exact to="/shop" key="shop" />
      )}
      {Roles.userIsInRole(Meteor.userId(), 'member') ? (
        <Menu.Item as={NavLink} content="Profile" icon="edit" activeClassName="edit" exact to={`/edit/${id}`} key="edit" />
      ) : (
        ''
      )}

      {Roles.userIsInRole(Meteor.userId(), 'register') ? (
        <Menu.Item as={NavLink} content="Register" icon="plus" activeClassName="active" exact to="/add" key="add" />
      ) : (
        ''
      )}

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
              to="/options"
              key="options"
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
              content="Service"
              icon="lock open"
              activeClassName="active"
              exact
              to="/service"
              key="service"
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
      {currentUser !== '' && (
        <>
          <Menu.Item as={NavLink} content="Sign out" icon="sign out" activeClassName="active" exact to="/signout" />
          <Menu.Item content={currentUser} />
        </>
      )}
    </Menu>
  )
}

/** Declare the types of all properties. */
NavBar.propTypes = {
  currentUser: PropTypes.string
}

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const NavBarContainer = withTracker(() => {
  const membersSub = Meteor.subscribe('all.members')
  const loading = !membersSub.ready()
  const currentMember = Members.find({ userId: Meteor.userId() }).fetch()[0]

  return {
    loading,
    currentUser: Meteor.user() ? Meteor.user().username : '',
    currentMember
  }
})(NavBar)

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(NavBarContainer)
