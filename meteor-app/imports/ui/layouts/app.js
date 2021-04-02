import React from 'react'
import PropTypes from 'prop-types'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Alert from '/imports/ui/utils/alert'
import 'semantic-ui-css/semantic.css'
import { Dimmer, Loader } from 'semantic-ui-react'
import { Roles } from 'meteor/alanning:roles'
import isIframe from '/imports/helpers/isIframe'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import context from '/imports/ui/utils/nav'

import NavBar from '../components/nav-bar'
import './app.css'

import Shop from '/imports/ui/shop'
import Ordering from '/imports/ui/layouts/ordering'
import PayNow from '../pages/pay-now'
import Payment from '/imports/ui/pay'
import PaymentThankyou from '/imports/ui/layouts/payment-thankyou'
import Service from '/imports/ui/service'
import Assessment from '/imports/ui/assessment/assessment'
import JobCardLister from '/imports/ui/assessment/assessment-job-card-lister'
import JobHistory from '/imports/ui/assessment/assessment-job-history'
import MemberAddContainer from '/imports/ui/member/member-add-container'
import MemberMainContainer from '/imports/ui/member-main-container'
import MemberEdit from '/imports/ui/member-edit'
import Visit from '/imports/ui/visit'
import MemberSignUp from '/imports/ui/signup'
import MemberPortal from '/imports/ui/portal'
import ForgotPin from '/imports/ui/signup/forgot-pin.js'

// These ones were created when initially setting up the new menu system,
// and can probably go at some stage
import NotFound from '../pages/not-found'
import Login from '../pages/login'
import Signout from '../pages/logout'
import Admin from '../pages/admin-routes'
import SuperAdmin from '../pages/super-admin'

const Home = props => {
  const isLogged = Meteor.userId() !== null
  if (isLogged) {
    context.set('mode', 'normal')
  }
  return <div>Home is where the heart is (app.js)</div>
}

/** Top-level layout component for this application. Called in imports/startup/client/startup. */
const App = props => {
  if (!Roles.subscription.ready()) return <div>NOT READY</div>
  const isLogged = Meteor.userId() !== null
  const showSide =
    (!isIframe() &&
      !(
        location.pathname.match(/kiosk/) ||
        location.pathname.match(/pay/) ||
        location.pathname.match(/paid/) ||
        location.pathname.match(/shop/) ||
        location.pathname.match(/visit/) ||
        location.pathname.match(/add/) ||
        location.pathname.match(/edit/)
      )) ||
    isLogged
  const containerId = showSide ? 'app-container' : 'iframe-container'
  return (
    <div id={containerId}>
      {showSide && (
        <div id="sidebar-container">
          <NavBar />
        </div>
      )}
      {!showSide && <div id="sidebar-none"></div>}
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signup/:id" component={MemberSignUp} />
          <Route path="/login" component={Login} />
          <Route path="/shop" component={Shop} />
          <Route path="/kiosk" component={MemberMainContainer} />
          <Route path="/pay/:jobNo" component={Payment} />
          <Route path="/visit/:id" component={Visit} />
          <Route path="/add" component={MemberAddContainer} />
          <Route path="/edit/:id" component={MemberEdit} />
          <Route path="/forgotpin/:id" component={ForgotPin} />
          <Route path="/paid/:jobNo" component={PaymentThankyou} />

          <SecureRoute role="member" path="/member-portal" component={MemberPortal} />

          <SecureRoute role="signin" path="/volsignin" component={MemberMainContainer} />

          <SecureRoute role="parts" path="/parts" component={Ordering} />

          <SecureRoute role="servicing" path="/service" component={Service} />
          <SecureRoute role="servicing" path="/assessment" component={Assessment} />
          <SecureRoute role="servicing" path="/jobs" component={JobCardLister} />
          <SecureRoute role="servicing" path="/job-history" component={JobHistory} />

          <SecureRoute role="paynow" path="/options" component={PayNow} />

          {/* <AdminProtectedRoute path="/admin" component={Admin} /> */}
          <SecureRoute role="admin" path="/admin" component={Admin} />

          <SecureRoute role="superadmin" path="/superadmin" component={SuperAdmin} />

          <SecureRoute path="/signout" component={Signout} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Alert stack={{ limit: 3 }} />
    </div>
  )
}

const GotoLogin = props => <Redirect to={{ pathname: '/login', state: { from: props.location } }} />

/**
 * SecureRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to login page.
 * @param {any} { component: Component, ...rest }
 */
const SecureRoute = ({ role, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const isLogged = Meteor.userId() !== null
      const hasRights = role ? Roles.userIsInRole(Meteor.userId(), role) : true
      return isLogged && hasRights ? <Component {...props} /> : <GotoLogin {...props} />
    }}
  />
)

/** Require a component and location to be passed to each SecureRoute. */
SecureRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object
}

//
// Add in a withTracker component, so that we end up waiting for the roles to be loaded before we render menus
//
const AppLoader = props => {
  if (props.loading)
    return (
      <div>
        <Dimmer active>
          <Loader size="massive">Loading</Loader>
        </Dimmer>
      </div>
    )
  return (
    <Router>
      <App {...props} />
    </Router>
  )
}

export default withTracker(props => {
  return {
    loading: !Roles.subscription.ready()
  }
})(AppLoader)
