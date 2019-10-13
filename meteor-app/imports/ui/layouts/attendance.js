import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Meteor } from 'meteor/meteor'
import NotFound from '/imports/ui/not-found'
import MemberAddContainer from '/imports/ui/member/member-add-container'
import AssessmentAddContainer from '/imports/ui/assessment/assessment'

import MemberMainContainer from '/imports/ui/member-main-container'
import MemberEdit from '/imports/ui/member-edit'
import Visit from '/imports/ui/visit'

import AdminContainer from '/imports/ui/admin/admin-container'
import WwccContainer from '/imports/ui/wwcc'
import SlsaContainer from '/imports/ui/slsa'
import DupesContainer from '/imports/ui/dupes'
import RenewalsContainer from '/imports/ui/renewals/container'
import AppSelection from '/imports/ui/admin/app-selection'
import PaymentConfirm from '/imports/ui/shop/payment-confirm'
import Alert from 'react-s-alert'
import '/imports/ui/layouts/attendance.css'

const Attendance = () => {
  const uploadXL = e => {
    e.preventDefault()

    const file = e.target[0].files[0]
    const msg = file ? 'Adding your parts' : 'Oops! Forgot to add the file? Try again uploading the file'
    Alert.info(msg)
    const reader = new FileReader()
    reader.onloadend = function () {
      const data = reader.result
      Meteor.callAsync('parts.load', data)
    }
    reader.readAsBinaryString(file)
  }

  return (
    <div className="attendance-wrapper">
      <title>Back 2 Bikes | Attendance</title>
      <div style={{ marginTop: '70px', height: '100%' }}>
        <Switch>
          <Route path="/admin" component={props => <AppSelection uploadXL={uploadXL} {...props} />} />
          <Route path="/userprofiles" component={AdminContainer} />
          <Route path="/wwcc" component={WwccContainer} />
          <Route path="/slsa" component={SlsaContainer} />
          <Route path="/useradmin" component={AdminContainer} />
          <Route path="/duplicates" component={DupesContainer} />
          <Route path="/renewals" component={RenewalsContainer} />
          <Route path="/add" component={MemberAddContainer} />
          <Route path="/assessment" component={AssessmentAddContainer} />
          <Route path="/payment-confirm" component={PaymentConfirm} />
          <Route path="/visit/:id" component={Visit} />
          <Route path="/edit/:id" component={MemberEdit} />

          <Route path="/" component={MemberMainContainer} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  )
}

export default Attendance
