import React from 'react';

import { render } from 'react-dom';
// Import routing components
import { BrowserRouter, HashRouter, Route, Switch, Link, Redirect } from 'react-router-dom';

// route components
import AttendanceApp from '/imports/ui/layouts/AttendanceApp.js';
import NotFoundPage from '/imports/ui/pages/NotFoundPage.js';
import HomePage from '/imports/ui/pages/HomePage.js';
import AddVolunteer from '/imports/ui/containers/AddVolunteerContainer.js';

export const renderRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={AttendanceApp}/>
      <Route exact path="/addvolunteer" component={AddVolunteer} />
      <Route path="*" component={NotFoundPage}/>
    </Switch>
  </BrowserRouter>
);

  // <Router history={browserHistory}>
  //     <Route path="/" component={AttendanceApp}/>
  //     <Route path="*" component={PageNotFound}/>
  // </Router>
