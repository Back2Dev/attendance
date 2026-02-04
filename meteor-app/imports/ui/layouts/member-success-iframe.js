import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MemberAddSuccessContainer from '/imports/ui/member/member-add-success-container'
import { AlertProvider } from '/imports/ui/utils/alert'

const MemberSuccessIframe = () => {
  return (
    <AlertProvider>
      <div style={{ height: '100%' }}>
        <Switch>
          <Route path="/success/:id" component={MemberAddSuccessContainer} />
        </Switch>
      </div>
    </AlertProvider>
  )
}

export default MemberSuccessIframe
