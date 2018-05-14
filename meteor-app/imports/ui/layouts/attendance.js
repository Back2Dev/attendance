import React from 'react'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/components/not-found'
import MemberAdd from '/imports/ui/components/member/member-add'
import MemberEdit from '/imports/ui/components/member/member-edit'
import MemberContainer from '/imports/ui/containers/member-container'
import MemberVisitContainer from '/imports/ui/containers/member-visit-container'
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
          <Route path="/:id/edit" component={MemberEdit} />
          <Route path="/:id" component={MemberVisitContainer} />
          <Route path="/add" component={MemberAdd} />
          <Route path="/" component={MemberContainer} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  )
}

export default Attendance

