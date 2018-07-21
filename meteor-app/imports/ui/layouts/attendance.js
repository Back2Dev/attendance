import React from 'react'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/not-found'
import MemberAddContainer from '/imports/ui/member/member-add-container'
<<<<<<< HEAD
import AssessmentAddContainer from '/imports/ui/assessment/assessment-add-container'
import Congratulations from '/imports/ui/assessment/assessment-congratulations'

=======
>>>>>>> 5347355f202ef656d2c36e66c7bc80a4f40c7a15

import MemberEdit from '/imports/ui/member/member-edit'
import MemberMainContainer from '/imports/ui/member-main-container'
import MemberVisitContainer from '/imports/ui/member/member-visit-container'
import AdminContainer from '/imports/ui/admin/admin-container'
import AppSelection from '/imports/ui/admin/app-selection'
import '/imports/ui/layouts/attendance.css'
import Nav from '/imports/ui/member/member-nav'

const Attendance = () => {
    return (
      <div className='attendance-wrapper'>
        <title>Back 2 Bikes | Attendance</title>
        <Nav />
        <div style={{ marginTop: '70px', height: '100%' }}>
          <Switch>
            <Route path="/admin" component={AppSelection} />
            <Route path="/userprofiles" component={AdminContainer} />
            <Route path="/add" component={MemberAddContainer} />
<<<<<<< HEAD
            <Route path="/assessment" component={AssessmentAddContainer} />
            <Route path="/congratulations" component={Congratulations} />
=======
>>>>>>> 5347355f202ef656d2c36e66c7bc80a4f40c7a15

            <Route path="/:id" component={MemberVisitContainer} />
            <Route path="/" component={MemberMainContainer} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    )
  }

export default Attendance

