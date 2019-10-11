import React from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import 'semantic-ui-css/semantic.css'
import { Roles } from 'meteor/alanning:roles'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import NavBar from '../components/nav-bar'
import Footer from '../components/footer'
import Landing from '../pages/landing'

import Shop from '/imports/ui/shop'
import Ordering from '/imports/ui/layouts/ordering'
import PayNow from '../pages/pay-now'

import NotFound from '../pages/not-found'
import Parts from '../pages/parts'
import Signin from '../pages/signin'
import Attendance from '/imports/ui/layouts/attendance'
import Signup from '../pages/signup'
import CurrentJobs from '../pages/current-jobs'
import NewService from '../pages/new-service'
import Signout from '../pages/signout'
import Admin from '../pages/admin.container'
import VolSignIn from '../pages/vol-sign-in'
import SuperAdmin from '../pages/super-admin'
import './app.css'

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
              <Route exact path="/" component={Landing} />
              <Route path="/signup" component={Signup} />
              <Route path="/signin" component={Signin} />
              <Route path="/shop" component={Shop} />

              <VolSignInProtectedRoute path="/volsignin" component={Attendance} />

              <PartsProtectedRoute path="/parts" component={Ordering} />

              <ServicingProtectedRoute path="/newservice" component={NewService} />
              <ServicingProtectedRoute path="/currentjobs" component={CurrentJobs} />

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
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
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
        <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
      )
    }}
  />
)

const VolSignInProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isLogged = Meteor.userId() !== null
      const hasRights = Roles.userIsInRole(Meteor.userId(), 'signin')
      return isLogged && hasRights ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
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
        <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
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
        <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
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
        <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
      )
    }}
  />
)

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
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
        <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
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
        <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
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
