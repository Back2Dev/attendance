import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import isIframe from '/imports/helpers/isIframe'
import Attendance from '/imports/ui/layouts/attendance'
import AssessmentLayout from '/imports/ui/layouts/assessment'
import Ordering from '/imports/ui/layouts/ordering'
import MemberAddIframe from '/imports/ui/layouts/member-add-iframe'
import JobCardList from '/imports/ui/assessment/assessment-job-card-list'
import Alert from 'react-s-alert';

// there is an iframe on the B2B wordpress site allowing registration to attendance app.
// we'll give them a different layout/component to prevent access to rest of the app
export const renderRoutes = () => (
  <div>
    <Alert stack={{ limit: 3 }} />
    <Router>
      <Switch>
        {isIframe() && <Route component={MemberAddIframe} />}
        <Route path="/ordering" component={Ordering} />
        <Route path="/assessment" component={AssessmentLayout} />
        <Route path="/jobs" component={JobCardList} />
        <Route component={Attendance} />
      </Switch>
    </Router>
  </div>
)
