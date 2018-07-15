import React from 'react'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/not-found'
import OrderingDataTracker from '/imports/ui/ordering/ordering-data-tracker'
import '/imports/ui/layouts/attendance.css'
import Nav from '/imports/ui/member/member-nav'
import Alert from 'react-s-alert';

const Ordering = () => {
    return (
      <div className='attendance-wrapper'>
        <title>Back2Bikes | Ordering</title>
        <Nav />
        <div style={{ marginTop: '70px', height: '100%' }}>
          <Switch>
            <Route path="/" component={OrderingDataTracker} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    )
  }

export default Ordering

