import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import isIframe from '/imports/helpers/isIframe'
import Attendance from '/imports/ui/layouts/attendance'
import Assessment from '/imports/ui/layouts/assessment'
import Ordering from '/imports/ui/layouts/ordering'
import MemberAddIframe from '/imports/ui/layouts/member-add-iframe'

// there is an iframe on the B2B wordpress site allowing registration to attendance app.
// we'll give them a different layout/component to prevent access to rest of the app
export const renderRoutes = () => (
  <Router>
    <Switch>
      {isIframe() && <Route component={MemberAddIframe} />}
      <Route path="/ordering" component={Ordering} />
      <Route path="/assessment" component={Assessment} />
      <Route component={Attendance} />
    </Switch>
  </Router>
)
