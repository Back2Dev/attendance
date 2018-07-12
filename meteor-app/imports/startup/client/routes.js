import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import isIframe from '/imports/helpers/isIframe'
import Attendance from '/imports/ui/layouts/attendance'
import Parts from '/imports/ui/layouts/parts'
import Assessment from '/imports/ui/layouts/assessment'
import MemberAddIframe from '/imports/ui/layouts/member-add-iframe'
import { alertsConfig } from '/imports/ui/config/alerts'
import 'react-s-alert/dist/s-alert-default.css'
import Alert from 'react-s-alert'

export const renderRoutes = () => (
  <div>
    <Alert {...alertsConfig} />
    <Router>
      <Switch>
        {// there is an iframe on the B2B wordpress site allowing registration to attendance app.
        // we'll give them a different layout/component to prevent access to rest of the app
        isIframe() && <Route component={MemberAddIframe} />}
        <Route path="/parts" component={Parts} />
        <Route path="/assess" component={Assessment} />
        <Route component={Attendance} />
      </Switch>
    </Router>
  </div>
)
