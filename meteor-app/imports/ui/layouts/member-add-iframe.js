import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MemberAddSuccessContainer from '/imports/ui/member/member-add-success-container'
import MemberAddContainer from '/imports/ui/member/member-add-container'
import { AlertProvider } from '/imports/ui/utils/alert'

const MemberAddIframe = () => {
  return (
    <AlertProvider>
      <div style={{ height: '100%' }}>
        <Switch>
          <Route path="/success/:id" component={MemberAddSuccessContainer} />
          <Route path="/" component={MemberAddContainer} />
        </Switch>
      </div>
    </AlertProvider>
  )
}

export default MemberAddIframe
