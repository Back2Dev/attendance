import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import isIframe from '/imports/helpers/isIframe'
import Attendance from '/imports/ui/layouts/attendance'
import MemberAddIframe from '/imports/ui/layouts/member-add-iframe'
import Ordering from '/imports/ui/layouts/ordering'

export const renderRoutes = () => (
  <Router>
    <Switch>
    {// there is an iframe on the B2B wordpress site allowing registration to attendance app.
    // we'll give them a different layout/component to prevent access to rest of the app
    isIframe() && <Route component={MemberAddIframe} />}
      <Route path="/ordering" component={Ordering} />
      <Route component={Attendance} />
    </Switch>
  </Router>
)
