import React from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import 'semantic-ui-css/semantic.css'
import { Roles } from 'meteor/alanning:roles'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import NavBar from '../components/nav-bar'
import './app.css'

import Shop from '/imports/ui/shop'
import Ordering from '/imports/ui/layouts/ordering'
import PayNow from '../pages/pay-now'
import Assessment from '/imports/ui/assessment/assessment'
import JobCardLister from '/imports/ui/assessment/assessment-job-card-lister'
import JobHistory from '/imports/ui/assessment/assessment-job-history'
import MemberAddContainer from '/imports/ui/member/member-add-container'
import Attendance from '/imports/ui/layouts/attendance'

// These ones were created when initially setting up the new menu system,
// and can probably go at some stage
import Landing from '../pages/landing'
import NotFound from '../pages/not-found'
import Login from '../pages/login'
import Signup from '../pages/signup'
import Signout from '../pages/logout'
import Admin from '../pages/admin.container'
import SuperAdmin from '../pages/super-admin'

/** Top-level layout component for this application. Called in imports/startup/client/startup. */
class App extends React.Component {
  render() {
    return (
      <Router>
        <div id="app-container">
          <div id="sidebar-container">
            <NavBar />
          </div>
          <div>
            <Switch>
              <Route exact path="/" component={Attendance} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/shop" component={Shop} />

              <VolsigninProtectedRoute path="/volsignin" component={Attendance} />
              <VolsigninProtectedRoute path="/add" component={MemberAddContainer} />

              <PartsProtectedRoute path="/parts" component={Ordering} />

              <ServicingProtectedRoute path="/assessment" component={Assessment} />
              <ServicingProtectedRoute path="/jobs" component={JobCardLister} />
              <ServicingProtectedRoute path="/job-history" component={JobHistory} />

              <PayNowProtectedRoute path="/paynow" component={PayNow} />

              <AdminProtectedRoute path="/admin" component={Admin} />

              <SuperAdminProtectedRoute path="/superadmin" component={SuperAdmin} />

              <ProtectedRoute path="/signout" component={Signout} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to login page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isLogged = Meteor.userId() !== null
      return isLogged ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    }}
  />
)

const VolsigninProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isLogged = Meteor.userId() !== null
      const hasRights = Roles.userIsInRole(Meteor.userId(), 'signin')
      return isLogged && hasRights ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    }}
  />
)

const PartsProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isLogged = Meteor.userId() !== null
      const hasRights = Roles.userIsInRole(Meteor.userId(), 'parts')
      return isLogged && hasRights ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    }}
  />
)

const ServicingProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isLogged = Meteor.userId() !== null
      const hasRights = Roles.userIsInRole(Meteor.userId(), 'servicing')
      return isLogged && hasRights ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    }}
  />
)

const PayNowProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isLogged = Meteor.userId() !== null
      const hasRights = Roles.userIsInRole(Meteor.userId(), 'paynow')
      return isLogged && hasRights ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    }}
  />
)

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to login page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isLogged = Meteor.userId() !== null
      const hasRights = Roles.userIsInRole(Meteor.userId(), 'admin')
      return isLogged && hasRights ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    }}
  />
)

const SuperAdminProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isLogged = Meteor.userId() !== null
      const hasRights = Roles.userIsInRole(Meteor.userId(), 'superadmin')
      return isLogged && hasRights ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    }}
  />
)

/** Require a component and location to be passed to each ProtectedRoute. */
ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object
}

/** Require a component and location to be passed to each AdminProtectedRoute. */
AdminProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object
}

SuperAdminProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object
}

export default App
