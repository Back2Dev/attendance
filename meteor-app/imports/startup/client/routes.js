import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import isIframe from '/imports/helpers/isIframe'
import Attendance from '/imports/ui/layouts/attendance'
import MemberAddIframe from '/imports/ui/layouts/member-add-iframe'

export const renderRoutes = () => (
  <Router>
    <Switch>
      {
        isIframe() &&
        <Route component={MemberAddIframe} />
      }
      <Route component={Attendance} />
    </Switch>
  </Router>
)
