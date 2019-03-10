import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/not-found'
import Purchase from '/imports/ui/purchase/purchase-option-card'
import '/imports/ui/layouts/attendance.css'
import Nav from '/imports/ui/member/member-nav'

import PurchaseContainer from '../purchase/purchase-container'

const PurchaseLayout = () => (
  <div className="Purchase-wrapper">
    <title>Back 2 Bikes | Purchase Sessions</title>
    <Nav />
        <div>
          <Switch>
            <Route path="/purchase" component={Purchase} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <PurchaseContainer/>
       
  </div>
)

export default PurchaseLayout
