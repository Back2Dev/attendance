import React from 'react';
import PropTypes from 'prop-types';
import UserOutContainer from '../containers/UserOutContainer';
import UserInContainer from '../containers/UserInContainer';
import UserContainer from '../containers/UserContainer'
import { withRouter } from 'react-router'
import { Route, Switch } from "react-router-dom";
import { Menu } from 'semantic-ui-react'
function AttendanceApp() {
  return (
    <div>
      <h1 className={'centered'}>Back-2-Bikes Attendance</h1>
      <Menu>
        <Menu.Item>Menu Item 1</Menu.Item>
        <Menu.Item>Menu Item 2</Menu.Item>
      </Menu>
      <Switch>
        <Route path="/users/checkin/:id" component={UserContainer} />
        <Route path="/users/" component={UserOutContainer} />
      </Switch>
    </div>
  );
}

export default withRouter(AttendanceApp);
