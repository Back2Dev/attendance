import React from 'react'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/not-found'
import MemberAddContainer from '/imports/ui/member/member-add-container'
import MemberEdit from '/imports/ui/member/member-edit'
import MemberContainer from '/imports/ui/member/member-container'
import MemberVisitContainer from '/imports/ui/member/member-visit-container'
import Dashboard from '/imports/ui/layouts/dashboard'
import '/imports/ui/layouts/attendance.css'
import Nav from '/imports/ui/member/member-nav'
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import { alertsConfig } from '/imports/ui/config/alerts'

const Attendance = () => {
    return (
      <div className='attendance-wrapper'>
        <title>Back 2 Bikes | Attendance</title>
        <Alert {...alertsConfig} />
        <Nav />
        <div style={{ marginTop: '70px', height: '100%' }}>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/add" component={MemberAddContainer} />
            <Route path="/:id/edit" component={MemberEdit} />
            <Route path="/:id" component={MemberVisitContainer} />
            <Route path="/" component={MemberContainer} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    )
  }

export default Attendance

