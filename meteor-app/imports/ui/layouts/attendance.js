import React from 'react'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/not-found'
import MemberAddContainer from '/imports/ui/member/add/member-add-container'
import MemberEdit from '/imports/ui/member/member-edit'
import MemberContainer from '/imports/ui/member/member-container'
import MemberVisitContainer from '/imports/ui/member/member-visit-container'
import Dashboard from '/imports/ui/layouts/dashboard'
import './attendance.css'

const Attendance = () => {
  return (
    <div className='attendance-wrapper'>
      <title>Back 2 Bikes | Attendance</title>
      <h1>Back 2 Bikes Attendance App</h1>
        <Switch>
          {/* urls could be dynamically changed depending on what site defines them as [members, clients etc]*/}
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/add" component={MemberAddContainer} />
          <Route path="/:id/edit" component={MemberEdit} />
          <Route path="/:id" component={MemberVisitContainer} />
          <Route path="/" component={MemberContainer} />
          <Route component={NotFound} />
        </Switch>
    </div>
  )
}

export default Attendance

