import React from 'react';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';
import { Link, Switch, Route } from 'react-router-dom'
import NotFound from '../components/not-found'
import RoleAdd from '../components/role-add'
import RoleEdit from '../components/role-edit'
import RolesContainer from '../containers/roles-container'
import RoleRegisterContainer from '../containers/role-register-container'
import Dashboard from '../layouts/dashboard'
const Attendance = () => {
  return (
    <div>
      <title>Back to Bikes | Attendance</title>
      <h1>Back 2 Bikes Attendance App</h1>
      <main>
        <Switch>
          {/* urls could be dynamically changed depending on what site defines them as [members, clients etc]*/}
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/:id/edit" component={RoleEdit} />
          <Route path="/:id" component={RoleRegisterContainer} />
          <Route path="/add" component={RoleAdd} />
          <Route path="/" component={RolesContainer} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  )
}

export default Attendance

