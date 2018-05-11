import React from 'react'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/components/not-found'
import RoleAdd from '/imports/ui/components/role-add'
import RoleEdit from '/imports/ui/components/role-edit'
import RolesContainer from '/imports/ui/containers/roles-container'
import RoleRegisterContainer from '/imports/ui/containers/role-register-container'
import Dashboard from '/imports/ui/layouts/dashboard'

const Attendance = () => {
  return (
    <div>
      <title>Back 2 Bikes | Attendance</title>
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

