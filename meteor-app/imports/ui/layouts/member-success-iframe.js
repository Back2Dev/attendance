import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MemberAddSuccessContainer from '/imports/ui/member/member-add-success-container'
import Alert from '/imports/ui/utils/alert'
import 'react-s-alert/dist/s-alert-default.css'
import { alertsConfig } from '/imports/ui/config/alerts'

const MemberSuccessIframe = () => {
  return (
    <div style={{ height: '100%' }}>
      {/* <Alert {...alertsConfig} /> */}
      <Switch>
        <Route path="/success/:id" component={MemberAddSuccessContainer} />
      </Switch>
    </div>
  )
}

export default MemberSuccessIframe
