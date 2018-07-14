import React from 'react'
import { Sidebar, Menu, Icon } from 'semantic-ui-react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/not-found'
import OrderingMainContainer from '/imports/ui/ordering/ordering-main-container'
import '/imports/ui/layouts/attendance.css'
import Nav from '/imports/ui/member/member-nav'
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import { alertsConfig } from '/imports/ui/config/alerts'

const Ordering = () => {
    return (
      <div className='attendance-wrapper'>
        <title>Back 2 Bikes | Ordering</title>
        <Alert {...alertsConfig} />
        <Nav />
        <div style={{ marginTop: '70px', height: '100%' }}>
          <Switch>
            <Route path="/" component={OrderingMainContainer} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    )
  }

export default Ordering

